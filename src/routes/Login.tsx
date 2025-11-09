import { useState } from "react";
import { supabase } from "../supabase/supabaseClient.ts";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub } from "react-icons/fa";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState<"login" | "register">("login");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (mode === "login") {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                setMessage("Connexion réussie !");
                navigate("/");
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage("Inscription réussie ! Vérifie ton email pour confirmer ton compte.");
            }
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = (provider: "google" | "discord" | "github") => {
        supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.origin },
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6 px-4">
            <h1 className="text-3xl font-bold">Connexion</h1>

            {/* --- Formulaire Email / Password --- */}
            <form
                onSubmit={handleAuth}
                className="login-form"
            >
                <h2 className="login-form-title">
                    {mode === "login" ? "Connexion par email" : "Créer un compte"}
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-form-input"
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-form-input"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="login-form-submit"
                >
                    {loading
                        ? "Chargement..."
                        : mode === "login"
                            ? "Se connecter"
                            : "S'inscrire"}
                </button>

                <p className="login-form-text">
                    {mode === "login" ? (
                        <>
                            Pas encore de compte ?{" "}
                            <button
                                type="button"
                                onClick={() => setMode("register")}
                                className="login-form-link"
                            >
                                S'inscrire
                            </button>
                        </>
                    ) : (
                        <>
                            Déjà un compte ?{" "}
                            <button
                                type="button"
                                onClick={() => setMode("login")}
                                className="login-form-link"
                            >
                                Se connecter
                            </button>
                        </>
                    )}
                </p>

                {message && (
                    <p
                        className={`text-sm text-center mt-2 ${
                            message.toLowerCase().includes("réussi")
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </form>

            {/* --- Séparateur --- */}
            <div className="flex items-center w-full max-w-sm">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-2 text-gray-500 text-sm">ou</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* --- OAuth Buttons --- */}
            <div className="flex flex-col gap-3 w-full max-w-sm">
                <button
                    type="button"
                    onClick={() => handleOAuth("google")}
                    className="flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg bg-white text-gray-800 border border-gray-200 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                >
                    <FcGoogle />
                    <span className="font-medium">Se connecter avec Google</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleOAuth("discord")}
                    className="flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg bg-indigo-600 text-white border border-transparent shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
                >
                    <FaDiscord />
                    <span className="font-medium">Se connecter avec Discord</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleOAuth("github")}
                    className="flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg bg-gray-800 text-white border border-transparent shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                    <FaGithub />
                    <span className="font-medium">Se connecter avec GitHub</span>
                </button>
            </div>
        </div>
    );
}
