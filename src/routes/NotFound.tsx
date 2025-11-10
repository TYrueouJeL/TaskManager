import { Link } from "react-router-dom";
import { RiHome2Line, RiErrorWarningLine } from "react-icons/ri";

export default function NotFound() {
    return (
        <div className="not-found">
            <div className="not-found-card">
                <div className="flex flex-col items-center gap-4">
                    <RiErrorWarningLine className="not-found-error" />
                    <h1 className="not-found-error-text">
                        404
                    </h1>
                    <h2 className="not-found-text">
                        Page introuvable
                    </h2>
                    <p className="not-found-subtext">
                        Oups ! La page que vous cherchez n’existe pas ou a été déplacée.
                    </p>
                </div>

                <div className="mt-6 flex justify-center">
                    <Link
                        to="/"
                        className="not-found-button"
                    >
                        <RiHome2Line />
                        Retour à l’accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
