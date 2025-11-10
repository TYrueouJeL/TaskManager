import App from './App.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ReactDOM from "react-dom/client";
import {StrictMode} from "react";
import Home from "./routes/Home.tsx";
import Login from "./routes/Login.tsx";
import Task from "./routes/task/Task.tsx";
import Project from "./routes/project/Project.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import TaskDetail, { loader as TaskDetailLoader } from "./routes/task/TaskDetail.tsx";
import ProjectDetail, { loader as ProjectDetailLoader } from "./routes/project/ProjectDetail.tsx";
import TaskEdit, { loader as TaskEditLoader } from "./routes/task/TaskEdit.tsx";
import TaskCreate from "./routes/task/TaskCreate.tsx";
import ProjectCreate from "./routes/project/ProjectCreate.tsx";
import ProjectEdit, { loader as ProjectEditLoader } from "./routes/project/ProjectEdit.tsx";
import NotFound from "./routes/NotFound.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFound />,
        children: [
            { path: "/", element: <Home/> },
            { path: "login", element: <Login/> },
            { path: "task", children: [
                    { path: "list", element: <ProtectedRoute><Task/></ProtectedRoute> },
                    { path: ":id", element: <ProtectedRoute><TaskDetail/></ProtectedRoute>, loader: TaskDetailLoader },
                    { path: "edit/:id", element: <ProtectedRoute><TaskEdit/></ProtectedRoute>, loader: TaskEditLoader},
                    { path: "create", element: <ProtectedRoute><TaskCreate/></ProtectedRoute>},
                ] },
            { path: "project", children: [
                    { path: "list", element: <ProtectedRoute><Project/></ProtectedRoute> },
                    { path: ":id", element: <ProtectedRoute><ProjectDetail/></ProtectedRoute>, loader: ProjectDetailLoader },
                    { path: "edit/:id", element: <ProtectedRoute><ProjectEdit/></ProtectedRoute>, loader: ProjectEditLoader},
                    { path: "create", element: <ProtectedRoute><ProjectCreate/></ProtectedRoute>},
                ]
            },
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