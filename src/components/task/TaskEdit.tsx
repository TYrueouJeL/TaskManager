import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { updateTask, getProjects } from "../../services/api.ts";

export default function TaskEdit({ task }: { task: any }) {
    const [title, setTitle] = useState(task.title || "");
    const [description, setDescription] = useState(task.description || "");
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split("T")[0] : "");
    const [projectId, setProjectId] = useState(task.project_id || task.projectId || "");
    const [projects, setProjects] = useState<Array<{ id: string; title: string }>>([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProjects() {
            const { data, error } = await getProjects();
            if (error) {
                console.error("Error fetching projects:", error);
                return;
            }
            setProjects(data || []);
        }
        fetchProjects();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const taskData = {
            title,
            description,
            dueDate,
            project_id: projectId === "" ? null : projectId,
        };

        const { error } = await updateTask(task.id, taskData);
        if (error) {
            console.error("Error updating task:", error);
            return;
        }

        navigate(`/task/${task.id}`);
    };

    return (
        <>
            <div className="project-detail__header">
                <h1 className="project-detail__title">Modifier la tâche {task.title}</h1>
                <Link to={`/task/${task.id}`} className="project-detail__link">← Retour</Link>
            </div>

            <form onSubmit={handleSubmit} className="task-edit-form">
                <div className="form-group">
                    <label htmlFor="title" className="form-label">Titre</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="form-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-textarea"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dueDate" className="form-label">Date d'échéance</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        className="form-input"
                        required
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="projectId" className="form-label">Projet</label>
                    <select
                        id="projectId"
                        name="projectId"
                        className="form-select"
                        value={projectId ?? ""}
                        onChange={(e) => setProjectId(e.target.value)}
                    >
                        <option value="">Aucun</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.title}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="form-submit">
                    Enregistrer les modifications
                </button>
            </form>
        </>
    );
}
