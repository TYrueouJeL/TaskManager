import ProjectForm from "./ProjectForm";

export default function ProjectEdit({ project }: { project: any }) {
    return <ProjectForm mode="edit" project={project} />;
}
