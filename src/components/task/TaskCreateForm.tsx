import TaskForm from "./TaskForm";

export default function TaskCreatePage() {
    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Créer une tâche</h1>

            {/* Utilisation du composant factorisé en mode "create" */}
            <TaskForm mode="create" />
        </div>
    );
}
