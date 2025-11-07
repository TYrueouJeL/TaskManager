import { useLoaderData } from "react-router";
import TaskDetail from "../../components/task/TaskDetail.tsx";
import {getTask} from "../../services/api.ts";
import {useEffect, useState} from "react";

export async function loader({ params }) {
    const [task, setTask] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const { data: taskData, error: taskError } = await getTask(params.id);
            if (taskError) {
                console.error('Error fetching task:', taskError);
            } else {
                setTask(taskData);
            }
        }
        fetchData();
    }, [params.id]);

    return { task };
}

export default function Task() {
    const { task } = useLoaderData();

    return (<TaskDetail task={task}/>);
}