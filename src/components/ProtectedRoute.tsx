import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth();

    if (loading) return <p>Chargement...</p>;

    if (!user) return <Navigate to="/login" replace />;

    return children;
}
