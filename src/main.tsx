import App from './App.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router";
import ReactDOM from "react-dom/client";
import {StrictMode} from "react";
import Home from "./routes/Home.tsx";
import Login from "./routes/Login.tsx";
import Task from "./routes/Task.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Home/> },
            { path: "login", element: <Login/> },
            { path: "task", element: <ProtectedRoute><Task/></ProtectedRoute> }
        ]
    }
])

const root = document.getElementById('root')!

ReactDOM.createRoot(root).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>,
)