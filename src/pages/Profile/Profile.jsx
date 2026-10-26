import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import useAuth from "../../hooks/useAuth"
import getUserDisplayName from "../../utils/getUserDisplayName"
import StartupCard from "../../components/StartupCard/StartupCard"
import Button from "../../components/Button/Button"
import { startups as sampleStartups } from "../../data/mockData"
import { supabase } from "../../services/supabase"
import "./Profile.css"

function Profile() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const displayName = getUserDisplayName(user)
    const username = user?.user_metadata?.username?.replace(/^@/, "") ||
        user?.email?.split("@")[0] ||
        "usuario"
    const isSupabaseConfigured = typeof supabase.from === "function"
    const [startups, setStartups] = useState([])
    const [loadingStartups, setLoadingStartups] = useState(true)
    const [startupError, setStartupError] = useState("")

    useEffect(() => {
        let active = true

        async function loadStartups() {
            if (!isSupabaseConfigured) {
                setStartups(
                    sampleStartups.filter((startup) => startup.founder === displayName)
                )
                setLoadingStartups(false)
                return
            }

            if (!user?.id) {
                setStartups([])
                setLoadingStartups(false)
                return
            }

            try {
                const { data, error } = await supabase
                    .from("startups")
                    .select("id,name,category,solution,problem,stage")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })

                if (error) {
                    throw error
                }

                if (active) {
                    setStartups(data || [])
                    setStartupError("")
                }
            } catch (error) {
                console.error("Erro ao carregar startups do perfil:", error)
                if (active) {
                    setStartups([])
                    setStartupError("Não foi possível carregar suas startups.")
                }
            } finally {
                if (active) {
                    setLoadingStartups(false)
                }
            }
        }

        setLoadingStartups(true)
        loadStartups()

        return () => {
            active = false
        }
    }, [displayName, isSupabaseConfigured, user?.id])

    return (
        <div className="profile">

            <main className="profile-content">

                    <section className="profile-header">

                        <div className="profile-avatar">
                            {displayName.charAt(0).toUpperCase()}
                        </div>

                        <div className="profile-info">

                            <h1>{displayName}</h1>

                            <span>@{username}</span>

                            <p>
                                {user?.user_metadata?.bio ||
                                    "Ainda não adicionou uma descrição."}
                            </p>

                            <div className="profile-stats">
                                <span>
                                    <strong>{startups.length}</strong> startups
                                </span>

                            </div>

                        </div>

                        <Button
                            variant="outline"
                            onClick={() => navigate("/configuration")}
                        >
                            Editar perfil
                        </Button>

                    </section>

                    <section className="profile-section">

                        <h2>Minhas startups</h2>

                        {startupError && <p role="status">{startupError}</p>}
                        {loadingStartups ? (
                            <p>Carregando startups...</p>
                        ) : startups.length ? (
                            <div className="profile-startups">
                                {startups.map((startup) => (
                                    <StartupCard
                                        key={startup.id || startup.name}
                                        id={startup.id}
                                        name={startup.name}
                                        description={
                                            startup.solution ||
                                            startup.problem ||
                                            startup.description
                                        }
                                        category={startup.category}
                                        stage={startup.stage}
                                        showStats={!isSupabaseConfigured}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>Você ainda não criou nenhuma startup.</p>
                        )}

                    </section>

                    <section className="profile-section">

                        <h2>Publicações</h2>

                        <p>As publicações ainda não estão conectadas ao banco de dados.</p>

                    </section>

            </main>

        </div>
    )
}

export default Profile