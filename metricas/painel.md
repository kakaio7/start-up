# 📊 StartUP — Painel de Métricas do Produto

## 1. Identificação

- **Produto:** StartUP
- **Objetivo:** conectar pessoas interessadas em criar startups e formar equipes.
- **Público-alvo:** empreendedores, estudantes, desenvolvedores e designers.
- **Período de referência:** 21/10/2026 a 22/10/2026.
- **Situação dos dados:** estimativas de uso simuladas para demonstrar os cálculos; respostas do NPS informadas como coletadas pela equipe; métricas de código a conferir no GitHub.

## 2. Métricas escolhidas

A equipe selecionou cinco métricas: três de produto e duas de código.

| Métrica | Tipo | Valor atual | Período | Se piorar, vamos... |
|---|---|---:|---|---|
| Taxa de ativação | Produto | 30% | 21–22/10/2026 — estimativa | Revisar o cadastro e as orientações do primeiro acesso |
| Retenção | Produto | 66,7% | Coorte ilustrativa de acompanhamento | Investigar por que os usuários não voltam |
| NPS | Produto | +40 | Pesquisa com 10 respostas | Coletar opiniões e investigar a experiência dos usuários |
| Commits | Código | 41 | 21–22/10/2026 | Verificar se alguém está bloqueado e revisar as tarefas |
| Bugs em aberto | Código | 5 | Situação atual a conferir | Priorizar correções dos erros mais importantes |

## 3. Cálculos obrigatórios

### 3.1. NPS — Net Promoter Score

Pergunta da pesquisa: **“De 0 a 10, quanto você recomendaria este produto?”**

**Respostas informadas:**

9, 8, 7, 10, 7, 10, 9, 7, 8, 7.

Total: 10 respostas.

**Promotores (notas 9–10):**
- Quantidade: 4 pessoas.
- Percentual: (4 ÷ 10) × 100 = 40%.

**Neutros (notas 7–8):**
- Quantidade: 6 pessoas.
- Percentual: (6 ÷ 10) × 100 = 60%.

**Detratores (notas 0–6):**
- Quantidade: 0 pessoas.
- Percentual: (0 ÷ 10) × 100 = 0%.

**Fórmula do NPS:**

NPS = % de promotores − % de detratores

**Cálculo:**

NPS = 40% − 0% = **+40**

**Interpretação:** o NPS é positivo. Entretanto, as seis respostas neutras indicam que ainda há espaço para melhorar a experiência do produto.

**Se este número piorar, a equipe vai:** investigar as dificuldades dos usuários e identificar melhorias prioritárias.

### 3.2. Retenção

A retenção mede a porcentagem dos usuários que começaram a utilizar o produto e voltaram durante o período de acompanhamento.

Para demonstrar a fórmula, é utilizada uma coorte ilustrativa:

- Usuários no início da coorte: 6.
- Usuários que voltaram: 4.
- Usuários que não voltaram: 2.

**Fórmula:**

Retenção = (usuários que voltaram ÷ usuários que começaram) × 100

**Cálculo:**

Retenção = (4 ÷ 6) × 100 = **66,7%**

**Interpretação:** no exemplo, quatro dos seis usuários voltaram a utilizar o produto.

**Se este número piorar, a equipe vai:** investigar as dificuldades no uso e melhorar os recursos que ajudam os usuários a encontrar projetos e colaboradores.

### 3.3. Churn

O churn mede a porcentagem dos usuários da coorte inicial que saíram ou não retornaram durante o acompanhamento.

**Dados da mesma coorte ilustrativa:**
- Usuários no início: 6.
- Usuários que não retornaram: 2.

**Fórmula:**

Churn = (usuários que saíram ÷ usuários no início) × 100

**Cálculo:**

Churn = (2 ÷ 6) × 100 = **33,3%**

**Conferência da relação entre retenção e churn:**

Retenção + Churn = 100%

66,7% + 33,3% = **100%**

**Interpretação:** no exemplo, dois dos seis usuários não retornaram.

**Se este número piorar, a equipe vai:** analisar os motivos da saída e priorizar melhorias que incentivem os usuários a voltar.

## 4. Funil AARRR

O funil AARRR organiza a jornada do usuário em cinco etapas: aquisição, ativação, retenção, receita e recomendação.

| Etapa | Número | Percentual e interpretação | Período |
|---|---|---|---|
| Aquisição | 20 pessoas | 100% dos visitantes estimados | 21–22/10/2026 — estimativa |
| Ativação | 6 pessoas | (6 ÷ 20) × 100 = 30% dos visitantes | 21–22/10/2026 — estimativa |
| Retenção | 4 pessoas | (4 ÷ 6) × 100 = 66,7% da coorte ativada ilustrativa | Coorte ilustrativa de acompanhamento |
| Receita | 0 pessoas pagantes | Monetização não implementada ou não mensurada | Não mensurado |
| Recomendação | NPS +40 | 4 promotores entre 10 respostas | Pesquisa com 10 respostas |

**Atenção:** os números de aquisição, ativação e retenção são estimativas para fins acadêmicos. A etapa de recomendação vem da pesquisa NPS e não deve ser interpretada como se fossem necessariamente as mesmas pessoas do funil.

### Onde está a maior queda?

A maior queda identificada no funil estimado ocorre entre **aquisição e ativação**.

- Visitantes: 20.
- Usuários ativados: 6.
- Visitantes que não se ativaram: 14.

**Fórmula da taxa de queda:**

Taxa de queda = ((visitantes − usuários ativados) ÷ visitantes) × 100

**Cálculo:**

((20 − 6) ÷ 20) × 100 = **70%**

**Resultado:** 70% dos visitantes estimados não chegaram à etapa de ativação.

Essa é a etapa prioritária a investigar, pois o problema ocorre antes de os visitantes conseguirem utilizar o produto de forma significativa.

## 5. Decisão coletiva

### Duas opções de ação

| Opção | O que ganhamos | O que abrimos mão |
|---|---|---|
| **A — Simplificar o cadastro e melhorar o primeiro acesso** | Pode facilitar a ativação de novos usuários e reduzir as dificuldades iniciais | Parte do tempo de desenvolvimento será dedicada ao cadastro e às orientações |
| **B — Corrigir bugs e melhorar a estabilidade** | Pode reduzir erros e tornar o produto mais confiável | A melhoria da entrada de novos usuários pode ficar para depois |

### Número que orienta a escolha

A estimativa indica que **14 de 20 visitantes não se ativaram, uma queda de 70% entre aquisição e ativação**.

Por esse motivo, a opção A é a prioridade proposta: simplificar o cadastro e melhorar as orientações do primeiro acesso.

**Registro do voto:** a equipe deve confirmar a opção escolhida após discutir as duas alternativas e realizar a votação informada. A decisão final e eventual discordância devem ser registradas em `metricas/decisao.md`.

## 6. Conclusão

A principal oportunidade de melhoria identificada no painel é a etapa de ativação. Na estimativa utilizada, 14 dos 20 visitantes não realizaram uma ação importante, representando uma queda de 70%.

A ação proposta é simplificar o cadastro e melhorar as orientações do primeiro acesso. Após a equipe confirmar essa decisão, a melhoria deverá ser registrada em uma Issue do GitHub, implementada e avaliada por uma nova medição da taxa de ativação.

**Próxima revisão sugerida:** 29/10/2026.
