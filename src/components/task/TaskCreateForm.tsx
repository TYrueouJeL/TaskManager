import { createTask, getActualUser } from "../../services/api.ts";
import { getProjects } from "../../services/api.ts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MDEditor from "@uiw/react-md-editor";
import {CheckCircle, Circle} from "lucide-react";

export default function TaskCreateForm() {
    const [projects, setProjects] = useState<Array<{ id: string; title: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState(""); // nouveau state pour l'éditeur
    const [mode, setMode] = useState<"daily" | "notDaily">("notDaily");
    const isDaily = mode === "daily";
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
        const dueDateRaw = formData.get("dueDate") as string;
        const dueDate = dueDateRaw === "" ? null : dueDateRaw;
        const projectId = formData.get("projectId") as string;
        const is_daily = mode === "daily";
        const user_id = (await getActualUser()).id;
        const project_id = projectId === "" ? null : projectId;

        const { data, error } = await createTask({ title, description, dueDate, is_daily, user_id, project_id });
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
                <label htmlFor="description" className="form-label">Description</label>
                <div className="border rounded">
                    <MDEditor
                        value={description}
                        onChange={setDescription}
                        height={300}
                    />
                </div>
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

            <div className="form-group">
                <label htmlFor="dueDate" className="form-label">Date d'échéance</label>
                <input type="date" id="dueDate" name="dueDate" className="form-input" required={mode === "notDaily"} />
            </div>

            <button
                type={"button"}
                onClick={() => setMode(isDaily ? "notDaily" : "daily")}
                className={`${isDaily
                    ? "button-is-daily"
                    : "button-is-not-daily"
                }`}
            >
                {isDaily ? (
                    <CheckCircle className="button-is-daily-icon" />
                ) : (
                    <Circle className="button-is-daily-icon" />
                )}
                <span>Quotidienne</span>
            </button>

            <button type="submit" className="form-button" disabled={loading}>
                {loading ? "Création…" : "Créer la tâche"}
            </button>
        </form>
    );
}
