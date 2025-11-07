import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import {updateTask, getProjects} from "../../services/api.ts";

export default function TaskEdit({ task }: { task: any }) {
    const [projects, setProjects] = useState<Array<{id: string, title: string}>>([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProject() {
            const { data, error } = await getProjects();
            if (error) {
                console.error('Error fetching project:', error);
                return;
            }
            setProjects(data || []);
        }
        fetchProject();
    }, [task.id]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const dueDate = formData.get('dueDate') as string;
        const projectId = formData.get('projectId') as string;
        const project_id = projectId === "" ? null : projectId;

        const { error } = await updateTask(task.id, { title, description, dueDate, project_id });
        if (error) {
            console.error("Error updating task:", error);
            return;
        }
        navigate(`/task/${task.id}`);
    }

    return (
        <>
            <div className="project-detail__header">
                <h1 className="project-detail__title">Modifier la tache {task.title}</h1>

                <Link to={`/task/${task.id}`} className="project-detail__link">← Retour</Link>
            </div>

            <form onSubmit={handleSubmit} className="task-edit-form">
                <div className="form-group">
                    <label htmlFor="title" className={"form-label"}>Titre</label>
                    <input type="text" id="title" name="title" required className="form-input" />
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea id="description" name="description" className="form-textarea" required/>
                </div>

                <div className="form-group">
                    <label htmlFor="dueDate" className="form-label">Date d'échéance</label>
                    <input type="date" id="dueDate" name="dueDate" className="form-input" required/>
                </div>

                <div className="form-group">
                    <label htmlFor="projectId" className="form-label">Projet</label>
                    <select id="projectId" name="projectId" className="form-select">
                        <option value="">Aucun</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.title}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="form-submit">Enregistrer les modifications</button>
            </form>
        </>
    );
}