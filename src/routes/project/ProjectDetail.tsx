import { useLoaderData } from "react-router";
import ProjectDetail from "../../components/project/ProjectDetail.tsx";
import {getProject} from "../../services/api.ts";

export async function loader({ params }) {
    const { data: project, error } = await getProject(params.id);

    if (error) {
        throw new Response("Task not found", { status: 404 });
    }

    return { project };
}

export default function Task() {
    const { project } = useLoaderData();

    return (<ProjectDetail project={project}/>);
}