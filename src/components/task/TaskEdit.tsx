import {type FormEvent, useState} from "react";
import {Link, useNavigate} from "react-router";
import {updateTask} from "../../services/api.ts";
import {RiDeleteBinLine, RiEditLine} from "react-icons/ri";

export default function TaskEdit({ task }: { task: any }) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const taskData = {
            title,
            description,
            dueDate,
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

                <button type="submit" className="form-submit">Enregistrer les modifications</button>
            </form>
        </>
    );
}