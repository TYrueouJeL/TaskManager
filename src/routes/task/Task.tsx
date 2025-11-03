import TaskList from "../../components/task/TaskList.tsx";
import TaskCard from "../../components/task/TaskCard.tsx";
import {useEffect, useState} from "react";
import {supabase} from "../../supabase/supabaseClient.ts";

export default function Task() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function loadTasks() {
            const { data, error } = await supabase
                .from('task')
                .select('*')
                .order('dueDate', { ascending: true });

            if (error) {
                console.error('Error fetching tasks:', error);
            } else {
                setTasks(data);
            }
        }

        loadTasks();
    }, []);
    return (
        <>
            <div className="flex flex-col items-center justify-center mb-4">
                <h1 className="text-4xl font-bold mb-4">Gestion des Tâches</h1>
                <p className="text-lg text-gray-600">Ici, vous pouvez gérer vos tâches.</p>
            </div>

            <TaskList tasks={tasks} />
        </>
    )
}