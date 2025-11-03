import {supabase} from "../supabase/supabaseClient.ts";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-bold">Connexion</h1>
            <button
                type="button"
                onClick={() =>
                    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
                }
                aria-label="Se connecter avec Google"
                className="flex items-center gap-3 px-5 py-2.5 rounded-lg bg-white text-gray-800 border border-gray-200 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
            >
                <FcGoogle />
                <span className="font-medium">Se connecter avec Google</span>
            </button>
            <button
                type="button"
                onClick={() =>
                    supabase.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo: window.location.origin } })
                }
                aria-label="Se connecter avec Discord"
                className="flex items-center gap-3 px-5 py-2.5 rounded-lg bg-indigo-600 text-white border border-transparent shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
            >
                <FaDiscord />
                <span className="font-medium">Se connecter avec Discord</span>
            </button>
        </div>
    )
}