import { Link, Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "./supabase/supabaseClient.ts";
import type { User } from "@supabase/supabase-js";
import ThemeToggle from "./components/ThemeToggle.tsx";
import { Menu, X } from "lucide-react";

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setMenuOpen(false);
        navigate("/");
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
            <header className="bg-background header shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-semibold cursor-pointer">
                        TaskManager
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-4">
                        <ul className="flex gap-3 items-center">
                            <li><Link to="/" className="header-button">Accueil</Link></li>
                            {user ? (
                                <>
                                    <li><Link to="/task/list" className="header-button">Tâches</Link></li>
                                    <li><Link to="/project/list" className="header-button">Projets</Link></li>
                                    <li>
                                        <button onClick={handleSignOut} className="header-button">
                                            Se déconnecter
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li><Link to="/login" className="header-button">Se connecter</Link></li>
                            )}
                        </ul>
                        <ThemeToggle />
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {menuOpen && (
                    <nav className="md:hidden bg-background border-t border-muted px-4 py-3 animate-slide-down">
                        <ul className="flex flex-col gap-3">
                            <li>
                                <Link
                                    to="/"
                                    onClick={() => setMenuOpen(false)}
                                    className="header-button block w-full text-left"
                                >
                                    Accueil
                                </Link>
                            </li>
                            {user ? (
                                <>
                                    <li>
                                        <Link
                                            to="/task/list"
                                            onClick={() => setMenuOpen(false)}
                                            className="header-button block w-full text-left"
                                        >
                                            Tâches
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/project/list"
                                            onClick={() => setMenuOpen(false)}
                                            className="header-button block w-full text-left"
                                        >
                                            Projets
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleSignOut}
                                            className="header-button block w-full text-left"
                                        >
                                            Se déconnecter
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <Link
                                        to="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="header-button block w-full text-left"
                                    >
                                        Se connecter
                                    </Link>
                                </li>
                            )}
                            <div className="mt-2">
                                <ThemeToggle />
                            </div>
                        </ul>
                    </nav>
                )}
            </header>

            <main className="container mx-auto px-4 py-6">
                <Outlet />
            </main>
        </>
    );
}

export default App;
