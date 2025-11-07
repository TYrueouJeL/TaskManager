import { Link } from 'react-router';
import { RiCheckLine, RiCloseLine, RiTimeLine } from 'react-icons/ri';
import {getProjectByTask} from "../../services/api.ts";
import {useEffect, useState} from "react";

export default function TaskCard({ task }) {
    const [project, setProject] = useState(null);
    const due = new Date(task.dueDate);
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const isDone = task.validationDate != null;
    const isToday = !isDone && due.toDateString() === now.toDateString();
    const isOverdue = !isDone && due < tomorrow;

    useEffect(() => {
        async function fetchProject() {
            const { data, error } = await getProjectByTask(task.id);
            if (error) {
                setProject(null);
            } else {
                setProject(data);
            }
        }
        fetchProject();
    }, [task.id]);

    const statusColor = isDone ? 'border-green-400' : isToday ? 'border-blue-400' : isOverdue ? 'border-red-400' : 'border-yellow-400';
    const statusIcon = isDone ? <RiCheckLine className="text-green-500" /> : isToday ? <RiTimeLine className="text-blue-500"/> : isOverdue ? <RiCloseLine className="text-red-500" /> : <RiTimeLine className="text-yellow-500" />;

    return (
        <Link to={`/task/${task.id}`} aria-label={`Ouvrir la tâche ${task.title}`}>
            <article
                className={`card-article ${statusColor}`}
                role="button"
            >
                <div className="flex-1 min-w-0">
                    <h3 className="card-title">
                        {task.title} {project ? `- ${project.title}` : ''}
                    </h3>
                    <p className="card-subtitle">
                        Date limite : {due.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </p>
                </div>

                <div className="flex flex-col items-end ml-4">
                    <span className="card-status-icon">
                        {statusIcon}
                    </span>
                    <span className={`mt-2 px-2 py-0.5 text-xs rounded-full font-medium ${isDone ? 'bg-green-100 text-green-800' : isToday ? 'bg-blue-100 text-blue-800' : isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {isDone ? 'Terminée' : isToday ? "Aujourd'hui" : isOverdue ? 'En retard' : 'À faire'}
                    </span>
                </div>
            </article>
        </Link>
    );
}
