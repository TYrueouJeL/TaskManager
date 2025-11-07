import { useLoaderData } from "react-router-dom";
import TaskDetail from "../../components/task/TaskDetail.tsx";
import {getTask} from "../../services/api.ts";

export async function loader({ params }) {
    const { data: taskData, error: taskError } = await getTask(params.id);

    if (taskError) {
        console.error("Erreur lors du chargement de la tâche :", taskError);
        throw new Response("Erreur lors du chargement de la tâche", { status: 500 });
    }

    return { task: taskData };
}

export default function Task() {
    const { task } = useLoaderData();

    return (<TaskDetail task={task}/>);
}