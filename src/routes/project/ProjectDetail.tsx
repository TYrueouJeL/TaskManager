import { useLoaderData } from "react-router";
import {supabase} from "../../supabase/supabaseClient.ts";
import ProjectDetail from "../../components/project/ProjectDetail.tsx";
import {useEffect} from "react";

export async function loader({ params }) {
    const { data: project, error } = await supabase
        .from('project')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error) {
        throw new Response("Task not found", { status: 404 });
    }

    return { project };
}

export default function Task() {
    const { project } = useLoaderData();

    return (<ProjectDetail project={project}/>);
}