import {supabase} from "../supabase/supabaseClient.ts";

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-bold">Connexion</h1>
            <button
                onClick={() =>
                    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
                }
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
                Se connecter avec Google
            </button>
            <button
                onClick={() =>
                    supabase.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo: window.location.origin } })
                }
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
                Se connecter avec Discord
            </button>
        </div>
    )
}