create table if not exists public.startups (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    name text not null check (char_length(trim(name)) between 2 and 120),
    category text not null check (char_length(trim(category)) between 2 and 80),
    problem text not null check (char_length(trim(problem)) between 5 and 2000),
    audience text not null check (char_length(trim(audience)) between 3 and 1000),
    solution text not null check (char_length(trim(solution)) between 5 and 2000),
    business_model text not null check (char_length(trim(business_model)) between 3 and 1000),
    stage text not null check (
        stage in ('Ideia', 'Validação', 'MVP', 'Lançamento', 'Crescimento')
    ),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists startups_created_at_idx
    on public.startups (created_at desc);

create index if not exists startups_user_created_at_idx
    on public.startups (user_id, created_at desc);

create table if not exists public.startup_goals (
    id uuid primary key default gen_random_uuid(),
    startup_id uuid not null references public.startups (id) on delete cascade,
    title text not null check (char_length(trim(title)) between 2 and 160),
    description text not null check (char_length(trim(description)) between 2 and 1000),
    stage text not null check (
        stage in ('Ideia', 'Validação', 'MVP', 'Lançamento', 'Crescimento')
    ),
    completed boolean not null default false,
    completed_at timestamptz,
    created_at timestamptz not null default now(),
    constraint startup_goals_completed_at_consistency check (
        (completed and completed_at is not null)
        or (not completed and completed_at is null)
    )
);

create index if not exists startup_goals_startup_stage_idx
    on public.startup_goals (startup_id, stage, created_at);

alter table public.startups enable row level security;
alter table public.startup_goals enable row level security;

drop policy if exists "Authenticated users can view startups"
    on public.startups;
create policy "Authenticated users can view startups"
    on public.startups for select
    to authenticated
    using (true);

drop policy if exists "Users can create their own startups"
    on public.startups;
create policy "Users can create their own startups"
    on public.startups for insert
    to authenticated
    with check (user_id = (select auth.uid()));

drop policy if exists "Users can update their own startups"
    on public.startups;
create policy "Users can update their own startups"
    on public.startups for update
    to authenticated
    using (user_id = (select auth.uid()))
    with check (user_id = (select auth.uid()));

drop policy if exists "Users can delete their own startups"
    on public.startups;
create policy "Users can delete their own startups"
    on public.startups for delete
    to authenticated
    using (user_id = (select auth.uid()));

drop policy if exists "Authenticated users can view startup goals"
    on public.startup_goals;
create policy "Authenticated users can view startup goals"
    on public.startup_goals for select
    to authenticated
    using (true);

drop policy if exists "Startup owners can create goals"
    on public.startup_goals;
create policy "Startup owners can create goals"
    on public.startup_goals for insert
    to authenticated
    with check (
        exists (
            select 1
            from public.startups startup
            where startup.id = startup_goals.startup_id
              and startup.user_id = (select auth.uid())
        )
    );

drop policy if exists "Startup owners can update goals"
    on public.startup_goals;
create policy "Startup owners can update goals"
    on public.startup_goals for update
    to authenticated
    using (
        exists (
            select 1
            from public.startups startup
            where startup.id = startup_goals.startup_id
              and startup.user_id = (select auth.uid())
        )
    )
    with check (
        exists (
            select 1
            from public.startups startup
            where startup.id = startup_goals.startup_id
              and startup.user_id = (select auth.uid())
        )
    );

drop policy if exists "Startup owners can delete goals"
    on public.startup_goals;
create policy "Startup owners can delete goals"
    on public.startup_goals for delete
    to authenticated
    using (
        exists (
            select 1
            from public.startups startup
            where startup.id = startup_goals.startup_id
              and startup.user_id = (select auth.uid())
        )
    );

grant select, insert, update, delete on public.startups to authenticated;
grant select, insert, update, delete on public.startup_goals to authenticated;

create or replace function public.create_startup_with_goals(
    startup_data jsonb,
    goals_data jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
    current_user_id uuid := auth.uid();
    new_startup_id uuid;
begin
    if current_user_id is null then
        raise exception 'É necessário entrar na conta para criar uma startup.';
    end if;

    if startup_data is null or jsonb_typeof(startup_data) <> 'object' then
        raise exception 'Os dados da startup estão inválidos.';
    end if;

    if goals_data is null or jsonb_typeof(goals_data) <> 'array' then
        raise exception 'As metas da startup estão inválidas.';
    end if;

    if jsonb_array_length(goals_data) = 0 then
        raise exception 'Os dados da startup ou as metas estão inválidos.';
    end if;

    insert into public.startups (
        user_id,
        name,
        category,
        problem,
        audience,
        solution,
        business_model,
        stage
    )
    values (
        current_user_id,
        trim(startup_data ->> 'name'),
        trim(startup_data ->> 'category'),
        trim(startup_data ->> 'problem'),
        trim(startup_data ->> 'audience'),
        trim(startup_data ->> 'solution'),
        trim(startup_data ->> 'business_model'),
        startup_data ->> 'stage'
    )
    returning id into new_startup_id;

    insert into public.startup_goals (
        startup_id,
        title,
        description,
        stage
    )
    select
        new_startup_id,
        trim(goal.title),
        trim(goal.description),
        startup_data ->> 'stage'
    from jsonb_to_recordset(goals_data) as goal(title text, description text);

    if not found then
        raise exception 'As metas da startup estão inválidas.';
    end if;

    return new_startup_id;
end;
$$;

revoke all on function public.create_startup_with_goals(jsonb, jsonb) from public, anon;
grant execute on function public.create_startup_with_goals(jsonb, jsonb) to authenticated;

create or replace function public.advance_startup_stage(
    target_startup_id uuid,
    target_stage text,
    goals_data jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    current_user_id uuid := auth.uid();
    current_stage text;
    stage_order text[] := array[
        'Ideia',
        'Validação',
        'MVP',
        'Lançamento',
        'Crescimento'
    ];
    current_stage_index integer;
begin
    if current_user_id is null then
        raise exception 'É necessário entrar na conta para avançar a startup.';
    end if;

    select startup.stage
    into current_stage
    from public.startups startup
    where startup.id = target_startup_id
      and startup.user_id = current_user_id
    for update;

    if not found then
        raise exception 'Startup não encontrada ou sem permissão.';
    end if;

    current_stage_index := array_position(stage_order, current_stage);
    if current_stage_index is null
        or current_stage_index >= array_length(stage_order, 1)
        or target_stage <> stage_order[current_stage_index + 1] then
        raise exception 'A startup só pode avançar para a próxima etapa.';
    end if;

    if goals_data is null or jsonb_typeof(goals_data) <> 'array' then
        raise exception 'As metas da próxima etapa estão inválidas.';
    end if;

    if jsonb_array_length(goals_data) = 0 then
        raise exception 'As metas da próxima etapa estão inválidas.';
    end if;

    if exists (
        select 1
        from public.startup_goals goal
        where goal.startup_id = target_startup_id
          and goal.stage = current_stage
          and not goal.completed
    ) then
        raise exception 'Conclua todas as metas antes de avançar.';
    end if;

    update public.startups
    set stage = target_stage,
        updated_at = now()
    where id = target_startup_id;

    insert into public.startup_goals (
        startup_id,
        title,
        description,
        stage
    )
    select
        target_startup_id,
        trim(goal.title),
        trim(goal.description),
        target_stage
    from jsonb_to_recordset(goals_data) as goal(title text, description text);

    if not found then
        raise exception 'As metas da próxima etapa estão inválidas.';
    end if;
end;
$$;

revoke all on function public.advance_startup_stage(uuid, text, jsonb) from public, anon;
grant execute on function public.advance_startup_stage(uuid, text, jsonb) to authenticated;
