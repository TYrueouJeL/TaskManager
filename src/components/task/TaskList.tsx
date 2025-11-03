import {useEffect, useState} from "react";
import { supabase } from "../../supabase/supabaseClient.ts";
import TaskCard from "./TaskCard.tsx";

export default function TaskList() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function loadTasks() {
            const { data, error } = await supabase
                .from('task')
                .select('*')

            if (error) {
                console.error('Error fetching tasks:', error);
            } else {
                setTasks(data);
            }
        }

        loadTasks();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    );
}