import {Link, Outlet} from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "./supabase/supabaseClient.ts";
import type { User } from "@supabase/supabase-js";
import ThemeToggle from "./components/ThemeToggle.tsx";

function App() {
    const [user, setUser] = useState<User | null>(null);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    return (
        <>
            <header className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-4 mb-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl cursor-default">TaskManager</h1>

                        <nav className="flex gap-4">
                            <ul className="flex gap-2">
                                <li><Link to="/" className="header-button">Accueil</Link></li>
                                {user ? (
                                    <>
                                        <li><Link to={"/task"} className="header-button">Tâches</Link></li>
                                        <li><button onClick={handleSignOut} className="header-button">Se déconnecter</button></li>
                                    </>
                                ) : (
                                    <li><Link to="/login" className="header-button">Se connecter</Link></li>
                                )}
                            </ul>
                        </nav>

                        <ThemeToggle/>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4">
                <Outlet/>
            </main>
        </>
    )
}

export default App