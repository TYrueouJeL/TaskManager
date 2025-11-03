import App from './App.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router";
import ReactDOM from "react-dom/client";
import {StrictMode} from "react";
import Home from "./routes/Home.tsx";
import Login from "./routes/Login.tsx";
import Task from "./routes/task/Task.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import TaskDetail, { loader as TaskDetailLoader } from "./routes/task/TaskDetail.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Home/> },
            { path: "login", element: <Login/> },
            { path: "task", element: <ProtectedRoute><Task/></ProtectedRoute> },
            { path: "task/:id", element: <TaskDetail/>, loader: TaskDetailLoader }
        ]
    }
])

const root = document.getElementById('root')!

ReactDOM.createRoot(root).render(
    <StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
)