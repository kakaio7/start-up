import { useNavigate } from "react-router-dom"

import "./StartupCard.css"

function StartupCard({
    id,
    name = "Minha Startup",
    description = "Descrição da startup",
    category = "Tecnologia",
    stage = "Ideia",
    members = 1,
    likes = 0,
    showStats = true,
    onClick
}) {
    const navigate = useNavigate()

    function handleViewStartup() {
        if (onClick) {
            onClick()
            return
        }

        if (id !== undefined && id !== null) {
            navigate(`/startup/${encodeURIComponent(id)}`)
            return
        }

        navigate(`/explore?${new URLSearchParams({ search: name }).toString()}`)
    }

    return (
        <article className="startup-card">

            <div className="startup-card-header">

                <div className="startup-logo">
                    🚀
                </div>

                <div className="startup-info">

                    <h3>{name}</h3>

                    <span className="startup-category">
                        {category}
                    </span>

                </div>

            </div>

            <p className="startup-description">
                {description}
            </p>

            <div className="startup-stage">
                <span>Etapa</span>

                <strong>
                    {stage}
                </strong>
            </div>

            {showStats && (
                <div className="startup-stats">
                    <span>👥 {members} membros</span>
                    <span>❤️ {likes}</span>
                </div>
            )}

            <button
                className="startup-card-button"
                onClick={handleViewStartup}
            >
                Ver startup →
            </button>

        </article>
    )
}

export default StartupCard