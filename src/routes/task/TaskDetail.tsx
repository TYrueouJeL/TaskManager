import { useLoaderData } from "react-router";
import TaskDetail from "../../components/task/TaskDetail.tsx";
import {getTask} from "../../services/api.ts";

export async function loader({ params }) {
    const { data: task, error } = await getTask(params.id);

    if (error) {
        throw new Response("Task not found", { status: 404 });
    }

    return { task };
}

export default function Task() {
    const { task } = useLoaderData();

    return (<TaskDetail task={task}/>);
}