import { createTask, getActualUser } from "../../services/api.ts";
import { getProjects } from "../../services/api.ts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MDEditor from "@uiw/react-md-editor";

export default function TaskCreateForm() {
    const [projects, setProjects] = useState<Array<{ id: string; title: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState(""); // nouveau state pour l'éditeur
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProjects() {
            const { data, error } = await getProjects();
            if (error) {
                console.log(error);
                return;
            }
            setProjects(data || []);
        }
        fetchProjects();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const title = formData.get("title") as string;
        const dueDate = formData.get("dueDate") as string;
        const projectId = formData.get("projectId") as string;
        const user_id = (await getActualUser()).id;
        const project_id = projectId === "" ? null : projectId;

        const { data, error } = await createTask({ title, description, dueDate, user_id, project_id });
        if (error) {
            console.error("Error creating task:", error);
            setLoading(false);
            return;
        }
        navigate(`/task/list`);
    };

    return (
        <form onSubmit={handleSubmit} className="task-create-form">
            <div className="form-group">
                <label htmlFor="title" className="form-label">Titre</label>
                <input type="text" id="title" name="title" required className="form-input" />
            </div>

            {/* Éditeur Markdown */}
            <div className="form-group">
                <label htmlFor="description" className="form-label">Description (Markdown accepté)</label>
                <div className="border rounded">
                    <MDEditor
                        value={description}
                        onChange={setDescription}
                        height={300}
                        className={"md-editor"}
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="dueDate" className="form-label">Date d'échéance</label>
                <input type="date" id="dueDate" name="dueDate" className="form-input" required />
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

            <button type="submit" className="form-button" disabled={loading}>
                {loading ? "Création…" : "Créer la tâche"}
            </button>
        </form>
    );
}
