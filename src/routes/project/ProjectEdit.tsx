import {getProject} from "../../services/api.ts";
import ProjectEdit from "../../components/project/ProjectEdit.tsx";
import {useLoaderData} from "react-router";

export async function loader({ params }) {
    const { data: project, error } = await getProject(params.id!);

    if (error) {
        throw new Response("Project not found", { status: 404 });
    }

    return { project };
}

export default function Project() {
    const { project } = useLoaderData() as { project: any };

    return (<ProjectEdit project={project}/>);
}