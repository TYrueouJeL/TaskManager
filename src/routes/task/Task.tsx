import TaskList from "../../components/task/TaskList.tsx";

export default function Task() {
    return (
        <>
            <div className="flex flex-col items-center justify-center mb-4">
                <h1 className="text-4xl font-bold mb-4">Gestion des Tâches</h1>
                <p className="text-lg text-gray-600">Ici, vous pouvez gérer vos tâches.</p>
            </div>

            

            <TaskList />
        </>
    )
}