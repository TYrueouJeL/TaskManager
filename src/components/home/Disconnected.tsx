import { Link } from "react-router";
import { RiCheckboxCircleLine, RiFolderOpenLine, RiAddLine, RiRocketLine } from "react-icons/ri";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <div className="disconnected-container">
        {/* Hero section */}
            <header className="disconnected-hero">
            <motion.h1
                    className="disconnected-h1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Organisez vos projets, simplifiez vos tâches.
                </motion.h1>

                <motion.p
                    className="disconnected-p"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    Une plateforme intuitive pour gérer vos projets, planifier vos tâches et suivre votre progression — le tout, sans stress.
                </motion.p>

                <motion.div
                    className="flex flex-wrap justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <Link to="/login" className="disconnected-button">
                        <RiRocketLine /> Commencer maintenant
                    </Link>
                    <Link to="/login" className="disconnected-button">
                        Se connecter
                    </Link>
                </motion.div>
            </header>

            {/* Features section */}
            <main className="disconnected-features">
                <div className="features-header">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Tout ce dont vous avez besoin pour rester organisé</h2>
                    <p className="text-gray-600">
                        Découvrez comment notre outil transforme la gestion de vos projets et de vos journées.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                    <RiCheckboxCircleLine className="text-4xl text-green-500 mb-4" />
                        <h3 className="feature-card-title">Gérez vos tâches</h3>
                        <p className="feature-card-description">
                            Créez, organisez et suivez vos tâches avec des priorités, des dates limites et des rappels clairs.
                        </p>
                    </div>

                    <div className="feature-card">
                        <RiFolderOpenLine className="text-4xl text-blue-500 mb-4" />
                        <h3 className="feature-card-title">Planifiez vos projets</h3>
                        <p className="feature-card-description">
                            Structurez vos idées et suivez l’avancement de vos projets avec une vision d’ensemble intuitive.
                        </p>
                    </div>

                    <div className="feature-card">
                        <RiAddLine className="text-4xl text-purple-500 mb-4" />
                        <h3 className="feature-card-title">Collaborez facilement</h3>
                        <p className="feature-card-description">
                            Invitez vos collaborateurs, partagez les tâches et suivez la progression en équipe.
                        </p>
                    </div>
                </div>
            </main>

            {/* CTA section */}
            <section className="disconnected-cta">
                <h2 className="disconnected-cta-title">
                    Prêt à booster votre productivité ?
                </h2>
                <p className="disconnected-cta-description">
                    Rejoignez des centaines d’utilisateurs qui gèrent mieux leur quotidien grâce à notre application.
                </p>
                <Link to="/register" className="disconnected-cta-button">
                    <RiRocketLine /> S’inscrire gratuitement
                </Link>
            </section>
        </div>
    );
}
