import { Link } from "react-router";
import TaskForm from "./TaskForm";

export default function TaskEditPage({ task }: { task: any }) {

    return (
        <>
            <div className="project-detail__header flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Modifier la tâche {task.title}</h1>
                <Link to={`/task/${task.id}`} className="text-blue-500 hover:underline">← Retour</Link>
            </div>

            {/* On utilise le composant factorisé en mode "edit" */}
            <TaskForm task={task} mode="edit" />
        </>
    );
}
