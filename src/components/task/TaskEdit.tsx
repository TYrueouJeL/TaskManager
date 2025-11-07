import {type FormEvent, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import {updateTask, getProjects} from "../../services/api.ts";

export default function TaskEdit({ task }: { task: any }) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
    const [projects, setProjects] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProject() {
            const { data: projectData, error } = await getProjects();
            if (error) {
                console.error('Error fetching project:', error);
                return;
            }
            setProjects(projectData);
        }
        fetchProject();
    }, [task.id]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const FormData = new FormData(event.currentTarget);
        const title = FormData.get('title') as string;
        const description = FormData.get('description') as string;
        const dueDate = FormData.get('dueDate') as string;
        const projectId = FormData.get('projectId') as string;
        const project_id = projectId === "" ? null : projectId;

        const taskData = {
            title,
            description,
            dueDate,
            project_id,
        };
        const { error } = await updateTask(task.id, taskData);
        if (error) {
            console.error('Error updating task:', error);
            return;
        }
        navigate(`/task/${task.id}`);
    }

    return (
        <>
            <div className="project-detail__header">
                <h1 className="project-detail__title">Modifier la tache {title}</h1>

                <Link to={`/task/${task.id}`} className="project-detail__link">← Retour</Link>
            </div>

            <form onSubmit={handleSubmit} className="task-edit-form">
                <div className="form-group">
                    <label htmlFor="title" className={"form-label"}>Titre</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className={"form-input"}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description" className={"form-label"}>Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={"form-textarea"}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dueDate" className={"form-label"}>Date d'échéance</label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className={"form-input"}
                    />
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