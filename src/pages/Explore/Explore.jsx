import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import StartupCard from "../../components/StartupCard/StartupCard"
import UserCard from "../../components/UserCard/UserCard"
import { startups as sampleStartups, users as sampleUsers } from "../../data/mockData"
import { supabase } from "../../services/supabase"
import useAuth from "../../hooks/useAuth"

import "./Explore.css"

function Explore() {

    const { user: currentUser } = useAuth()
    const [filter, setFilter] = useState("startups")
    const [searchParams] = useSearchParams()
    const search = searchParams.get("search")?.trim() || ""
    const isSupabaseConfigured = typeof supabase.from === "function"
    const [startups, setStartups] = useState(
        isSupabaseConfigured ? [] : sampleStartups
    )
    const [users, setUsers] = useState(
        isSupabaseConfigured ? [] : sampleUsers
    )
    const [loadingStartups, setLoadingStartups] = useState(
        isSupabaseConfigured
    )
    const [loadingUsers, setLoadingUsers] = useState(isSupabaseConfigured)
    const [startupLoadError, setStartupLoadError] = useState("")
    const [peopleLoadError, setPeopleLoadError] = useState("")

    useEffect(() => {
        let isActive = true

        async function loadStartups() {
            if (!isSupabaseConfigured) {
                setStartups(sampleStartups)
                setLoadingStartups(false)
                return
            }

            try {
                const { data, error } = await supabase
                    .from("startups")
                    .select("id,name,category,problem,audience,solution,business_model,stage,created_at")
                    .order("created_at", { ascending: false })

                if (error) {
                    throw error
                }

                if (!isActive) {
                    return
                }

                setStartups((data || []).map((startup) => ({
                    ...startup,
                    description: startup.solution || startup.problem,
                    members: 1,
                    likes: 0,
                    showStats: false
                })))
                setStartupLoadError("")
            } catch (error) {
                console.error("Erro ao buscar startups para explorar:", error)
                if (isActive) {
                    setStartupLoadError(
                        "Não foi possível carregar as startups da sua comunidade."
                    )
                }
            } finally {
                if (isActive) {
                    setLoadingStartups(false)
                }
            }
        }

        loadStartups()

        return () => {
            isActive = false
        }
    }, [isSupabaseConfigured])

    useEffect(() => {
        let isActive = true

        async function loadPeople() {
            if (!isSupabaseConfigured) {
                setUsers(sampleUsers)
                setLoadingUsers(false)
                return
            }

            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("id,display_name,username")
                    .order("display_name")

                if (error) {
                    throw error
                }

                if (!isActive) {
                    return
                }

                setUsers((data || [])
                    .filter((person) => person.id !== currentUser?.id)
                    .map((person) => ({
                        id: person.id,
                        name: person.display_name,
                        username: person.username
                            ? `@${person.username.replace(/^@/, "")}`
                            : "",
                        role: "Membro da comunidade",
                        skills: [],
                        followers: undefined
                    })))
                setPeopleLoadError("")
            } catch (error) {
                console.error("Erro ao buscar pessoas para explorar:", error)
                if (isActive) {
                    setUsers([])
                    setPeopleLoadError(
                        "Não foi possível carregar os perfis da comunidade."
                    )
                }
            } finally {
                if (isActive) {
                    setLoadingUsers(false)
                }
            }
        }

        loadPeople()

        return () => {
            isActive = false
        }
    }, [currentUser?.id, isSupabaseConfigured])

    const normalizeText = (value) =>
        String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("pt-BR")
    const normalizedSearch = normalizeText(search)
    const filteredStartups = useMemo(
        () =>
            startups.filter((startup) =>
                [
                    startup.name,
                    startup.description,
                    startup.solution,
                    startup.category,
                    startup.stage
                ]
                    .join(" ")
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLocaleLowerCase("pt-BR")
                    .includes(normalizedSearch)
            ),
        [startups, normalizedSearch]
    )
    const filteredUsers = useMemo(
        () =>
            users.filter((user) =>
                [
                    user.name,
                    user.username,
                    user.role,
                    ...user.skills
                ]
                    .join(" ")
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLocaleLowerCase("pt-BR")
                    .includes(normalizedSearch)
            ),
        [normalizedSearch, users]
    )

    return (
        <div className="explore">

            <h1>Explorar</h1>

            <p className="explore-subtitle">
                Descubra startups, pessoas e oportunidades.
            </p>

            <div className="explore-tabs">

                <button
                    className={
                        filter === "startups"
                            ? "active"
                            : ""
                    }
                    onClick={() => setFilter("startups")}
                >
                    🚀 Startups
                </button>

                <button
                    className={
                        filter === "people"
                            ? "active"
                            : ""
                    }
                    onClick={() => setFilter("people")}
                >
                    👥 Pessoas
                </button>

            </div>

            {search && (
                <div className="explore-search">
                    Resultados para:
                    <strong> "{search}"</strong>
                </div>
            )}

            {filter === "startups" && (
                <>
                    {startupLoadError && (
                        <p className="explore-error" role="status">
                            {startupLoadError}
                        </p>
                    )}
                    {loadingStartups ? (
                        <p className="explore-empty" role="status">
                            Buscando startups...
                        </p>
                    ) : (
                        <div className="explore-grid">
                            {filteredStartups.map((startup) => (
                                <StartupCard
                                    key={startup.id || startup.name}
                                    {...startup}
                                />
                            ))}
                            {filteredStartups.length === 0 && (
                                <p className="explore-empty">
                                    Nenhuma startup encontrada para “{search}”.
                                </p>
                            )}
                        </div>
                    )}
                </>
            )}

            {filter === "people" && (
                <div className="explore-users">
                    {peopleLoadError && (
                        <p className="explore-error" role="status">
                            {peopleLoadError}
                        </p>
                    )}
                    {loadingUsers ? (
                        <p className="explore-empty" role="status">
                            Buscando pessoas...
                        </p>
                    ) : filteredUsers.map((person) => (
                        <UserCard
                            key={person.id || person.username}
                            {...person}
                        />
                    ))}
                    {!loadingUsers && filteredUsers.length === 0 && (
                        <p>Nenhuma pessoa encontrada.</p>
                    )}
                </div>
            )}

        </div>
    )
}

export default Explore