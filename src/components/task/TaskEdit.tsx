import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { updateTask, getProjects } from "../../services/api.ts";
import MDEditor from "@uiw/react-md-editor";
import {CheckCircle, Circle} from "lucide-react";

export default function TaskEdit({ task }: { task: any }) {
    const [title, setTitle] = useState(task.title || "");
    const [description, setDescription] = useState(task.description || "");
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split("T")[0] : null);
    const [projectId, setProjectId] = useState(task.project_id || task.projectId || "");
    const [projects, setProjects] = useState<Array<{ id: string; title: string }>>([]);
    const [mode, setMode] = useState<"daily" | "notDaily">(task.is_daily ? "daily" : "notDaily");
    const isDaily = mode === "daily";
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
            is_daily: isDaily,
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
                    <label htmlFor="dueDate" className="form-label">Date d'échéance</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        className="form-input"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value == "" ? null : e.target.value)}
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

                <button
                    type={"button"}
                    onClick={() => setMode(isDaily ? "notDaily" : "daily")}
                    className={`${isDaily
                        ? "button-is-daily"
                        : "button-is-not-daily"
                    }`}
                >
                    {isDaily ? (
                        <CheckCircle className={`${isDaily
                            ? "button-is-daily-icon"
                            : "button-is-not-daily-icon"
                        }`} />
                    ) : (
                        <Circle className={`${isDaily
                            ? "button-is-daily-icon"
                            : "button-is-not-daily-icon"
                        }`} />
                    )}
                    <span>Quotidienne</span>
                </button>

                <button type="submit" className="form-button">
                    Enregistrer les modifications
                </button>
            </form>
        </>
    );
}
