
import { useRef, useState } from "react"

import { useNavigate } from "react-router-dom"

import Button from "../../components/Button/Button"

import useAuth from "../../hooks/useAuth"

import { supabase } from "../../services/supabase"
import { validateStartup } from "../../utils/validation"

import "./CreateStartup.css"


const stageGoals = {

    Ideia: [

        {
            title: "Definir o problema",

            description:
                "Descrever claramente qual problema sua startup resolve."
        },

        {
            title: "Definir o público-alvo",

            description:
                "Identificar quem possui esse problema."
        },

        {
            title: "Definir a solução",

            description:
                "Explicar como sua startup resolve o problema."
        }

    ],

    Validação: [

        {
            title: "Conversar com usuários",

            description:
                "Entrevistar pessoas que fazem parte do público-alvo."
        },

        {
            title: "Validar o problema",

            description:
                "Descobrir se o problema realmente existe e é relevante."
        },

        {
            title: "Validar a solução",

            description:
                "Verificar se os usuários demonstram interesse na solução."
        }

    ],

    MVP: [

        {
            title: "Criar o protótipo",

            description:
                "Criar a primeira versão funcional do produto."
        },

        {
            title: "Implementar a funcionalidade principal",

            description:
                "Desenvolver aquilo que realmente resolve o problema."
        },

        {
            title: "Testar com usuários",

            description:
                "Colocar o MVP nas mãos de usuários reais."
        }

    ],

    Lançamento: [

        {
            title: "Publicar o produto",

            description:
                "Disponibilizar o produto para usuários."
        },

        {
            title: "Conseguir os primeiros usuários",

            description:
                "Atrair os primeiros usuários reais."
        },

        {
            title: "Coletar feedback",

            description:
                "Registrar problemas, sugestões e necessidades."
        }

    ],

    Crescimento: [

        {
            title: "Aumentar usuários ativos",

            description:
                "Criar estratégias para aumentar a utilização do produto."
        },

        {
            title: "Melhorar retenção",

            description:
                "Fazer com que os usuários continuem utilizando o produto."
        },

        {
            title: "Aumentar receita",

            description:
                "Criar estratégias para tornar o negócio sustentável."
        }

    ]

}


function CreateStartup() {

    const navigate = useNavigate()

    const {
        user,
        loading: authLoading
    } = useAuth()


    const [step, setStep] = useState(1)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const formRef = useRef(null)


    const [startup, setStartup] = useState({

        name: "",

        category: "",

        problem: "",

        audience: "",

        solution: "",

        businessModel: "",

        stage: "Ideia"

    })


    function handleChange(event) {

        const {
            name,
            value
        } = event.target


        setStartup(previous => ({

            ...previous,

            [name]: value

        }))
        setError("")
    }

    function nextStep() {
        if (!formRef.current?.reportValidity()) {
            return
        }

        const requiredFieldsByStep = {
            1: ["name", "category"],
            2: ["problem", "audience"],
            3: ["solution", "businessModel"]
        }
        const missingField = requiredFieldsByStep[step].some(
            (field) => !String(startup[field] || "").trim()
        )

        if (missingField) {
            setError("Preencha os campos obrigatórios desta etapa.")
            return
        }

        if (step < 4) {
            setError("")
            setStep(
                previous => previous + 1
            )

        }

    }


    function previousStep() {

        if (step > 1) {

            setStep(
                previous => previous - 1
            )

        }

    }


    async function handleSubmit(event) {

        event.preventDefault()

        const validation = validateStartup(startup)
        if (!validation.valid) {
            setError(Object.values(validation.errors).join(" "))
            return
        }

        setError("")

        if (authLoading) {
            return
        }

        if (typeof supabase.rpc !== "function") {
            setError("Conecte o Supabase para cadastrar startups.")
            return
        }

        if (!user) {

            alert(
                "Sua sessão não foi encontrada. Faça login novamente."
            )

            navigate("/login")

            return

        }


        try {

            setLoading(true)

            const goals =
                stageGoals[startup.stage] || []

            const { data: startupId, error: startupError } = await supabase.rpc(
                "create_startup_with_goals",
                {
                    startup_data: {
                        name: startup.name,
                        category: startup.category,
                        problem: startup.problem,
                        audience: startup.audience,
                        solution: startup.solution,
                        business_model: startup.businessModel,
                        stage: startup.stage
                    },
                    goals_data: goals
                }
            )

            if (startupError) {
                if (
                    startupError.code === "PGRST202" ||
                    startupError.message?.includes("create_startup_with_goals")
                ) {
                    throw new Error(
                        "A função do banco ainda não existe. Execute a migration 20261026093000_startups_and_goals.sql no SQL Editor do Supabase."
                    )
                }

                throw startupError
            }

            if (!startupId) {
                throw new Error("O banco não retornou o ID da startup criada.")
            }

            // =========================
            // SUCESSO
            // =========================

            alert(
                " Parabéns!! Sua startup foi criada com sucesso!-"
            )


            navigate(`/startup/${startupId}`)


        } catch (error) {

            console.error(
                "Erro ao criar startup:",
                error
            )


            setError(
                error.message ||
                "Não foi possível criar a startup. Tente novamente."
            )

        } finally {

            setLoading(false)

        }

    }


    return (

        <div className="create-startup">

            <div className="create-header">

                <h1>
                    🚀 Criar Startup
                </h1>

                <p>
                    Transforme sua ideia em um projeto real.
                </p>

            </div>


            <div className="create-progress">

                {[1, 2, 3, 4].map(number => (

                    <div
                        key={number}

                        className={
                            step >= number
                                ? "progress-step active"
                                : "progress-step"
                        }
                    >

                        {number}

                    </div>

                ))}

            </div>


            <form
                ref={formRef}
                className="startup-form"
                onSubmit={handleSubmit}
            >

                {error && (
                    <div className="login-message login-error" role="alert">
                        {error}
                    </div>
                )}

                {step === 1 && (

                    <div>

                        <h2>
                            Comece pela ideia
                        </h2>


                        <label>

                            Nome da startup

                            <input
                                name="name"

                                value={startup.name}

                                onChange={handleChange}

                                placeholder="Ex: StartTech"

                                required
                            />

                        </label>


                        <label>

                            Categoria

                            <select
                                name="category"

                                value={startup.category}

                                onChange={handleChange}

                                required
                            >

                                <option value="">
                                    Selecione
                                </option>

                                <option value="Tecnologia">
                                    Tecnologia
                                </option>

                                <option value="Educação">
                                    Educação
                                </option>

                                <option value="Finanças">
                                    Finanças
                                </option>

                                <option value="Saúde">
                                    Saúde
                                </option>

                                <option value="Sustentabilidade">
                                    Sustentabilidade
                                </option>

                                <option value="Inteligência Artificial">
                                    Inteligência Artificial
                                </option>

                            </select>

                        </label>

                    </div>

                )}


                {step === 2 && (

                    <div>

                        <h2>
                            Qual problema você resolve?
                        </h2>


                        <label>

                            Problema

                            <textarea
                                name="problem"

                                value={startup.problem}

                                onChange={handleChange}

                                placeholder="Descreva o problema..."

                                required
                            />

                        </label>


                        <label>

                            Público-alvo

                            <textarea
                                name="audience"

                                value={startup.audience}

                                onChange={handleChange}

                                placeholder="Quem possui esse problema?"

                                required
                            />

                        </label>

                    </div>

                )}


                {step === 3 && (

                    <div>

                        <h2>
                            Como sua startup resolve?
                        </h2>


                        <label>

                            Solução

                            <textarea
                                name="solution"

                                value={startup.solution}

                                onChange={handleChange}

                                placeholder="Descreva sua solução..."

                                required
                            />

                        </label>


                        <label>

                            Modelo de negócio

                            <textarea
                                name="businessModel"

                                value={startup.businessModel}

                                onChange={handleChange}

                                placeholder="Como sua startup ganhará dinheiro?"

                                required
                            />

                        </label>

                    </div>

                )}


                {step === 4 && (

                    <div>

                        <h2>
                            Última etapa 🚀
                        </h2>


                        <label>

                            Estágio atual

                            <select
                                name="stage"

                                value={startup.stage}

                                onChange={handleChange}
                            >

                                <option value="Ideia">
                                    Ideia
                                </option>

                                <option value="Validação">
                                    Validação
                                </option>

                                <option value="MVP">
                                    MVP
                                </option>

                                <option value="Lançamento">
                                    Lançamento
                                </option>

                                <option value="Crescimento">
                                    Crescimento
                                </option>

                            </select>

                        </label>


                        <div className="startup-summary">

                            <h3>
                                Resumo
                            </h3>


                            <p>

                                <strong>
                                    Nome:
                                </strong>{" "}

                                {startup.name}

                            </p>


                            <p>

                                <strong>
                                    Categoria:
                                </strong>{" "}

                                {startup.category}

                            </p>


                            <p>

                                <strong>
                                    Problema:
                                </strong>{" "}

                                {startup.problem}

                            </p>


                            <p>

                                <strong>
                                    Solução:
                                </strong>{" "}

                                {startup.solution}

                            </p>


                            <p>

                                <strong>
                                    Estágio:
                                </strong>{" "}

                                {startup.stage}

                            </p>

                        </div>

                    </div>

                )}


                <div className="form-actions">

                    {step > 1 && (

                        <Button
                            type="button"

                            variant="secondary"

                            onClick={previousStep}
                        >
                            ← Voltar
                        </Button>

                    )}


                    {step < 4 ? (

                        <Button
                            type="button"

                            onClick={nextStep}
                        >
                            Próximo →
                        </Button>

                    ) : (

                        <Button
                            type="submit"

                            disabled={
                                loading ||
                                authLoading
                            }
                        >

                            {loading

                                ? "Criando..."

                                : "🚀 Criar Startup"

                            }

                        </Button>

                    )}

                </div>

            </form>

        </div>

    )

}


export default CreateStartup
