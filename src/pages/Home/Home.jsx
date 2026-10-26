import Post from "../../components/Post/Post"
import StartupCard from "../../components/StartupCard/StartupCard"
import UserCard from "../../components/UserCard/UserCard"

import useAuth from "../../hooks/useAuth"
import getUserDisplayName from "../../utils/getUserDisplayName"
import { currentUser, posts as mockPosts, startups as mockStartups, users as mockUsers } from "../../data/mockData"

import "./Home.css"

function Home() {

    const { user } = useAuth()

    const displayName = user
        ? getUserDisplayName(user)
        : currentUser.name

    const firstName = displayName.split(" ")[0]

    const posts = mockPosts.slice(0, 2)
    const startups = mockStartups.slice(0, 2)
    const suggestedUsers = mockUsers.slice(0, 2)

    return (
        <div className="home">
            <section className="home-welcome">
                <div>
                    <h1>Olá, {firstName}! 👋</h1>
                    <p>
                        O que você vai construir hoje?
                    </p>
                </div>

            </section>

            <section className="home-feed">

                <div className="home-main">

                    <div className="section-title">
                        <h2>Seu feed</h2>
                    </div>

                    {posts.map((post, index) => (
                        <Post
                            key={post.id || index}
                            {...post}
                        />
                    ))}

                </div>

                <aside className="home-right">

                    <div className="home-widget">

                        <h3>
                            🚀 Startups em destaque
                        </h3>

                        {startups.map((startup) => (
                            <StartupCard
                                key={startup.id || startup.name}
                                {...startup}
                            />
                        ))}

                    </div>

                    <div className="home-widget">

                        <h3>
                            👥 Pessoas para conhecer
                        </h3>

                        {suggestedUsers.map((person) => (
                            <UserCard
                                key={person.id || person.username}
                                name={person.name}
                                username={person.username}
                                role={person.role}
                                skills={person.skills}
                                followers={person.followers}
                            />
                        ))}

                    </div>

                </aside>

            </section>
        </div>
    )
}

export default Home