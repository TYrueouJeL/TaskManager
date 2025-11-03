import { useLoaderData } from "react-router";
import TaskDetail from "../../components/task/TaskDetail.tsx";
import {supabase} from "../../supabase/supabaseClient.ts";

export async function loader({ params }) {
    const { data: task, error } = await supabase
        .from('task')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error) {
        throw new Response("Task not found", { status: 404 });
    }

    return { task };
}

export default function Task() {
    const { task } = useLoaderData();

    return (<TaskDetail task={task}/>);
}