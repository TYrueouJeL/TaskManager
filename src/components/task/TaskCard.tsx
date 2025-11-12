import { Link } from 'react-router';
import StatusIcon from '../shared/StatusIcon';
import StatusBadge from '../shared/StatusBadge';
import { calculateTaskStatus, formatDate } from '../../utils/dateUtils';

export default function TaskCard({ task }) {
    const status = calculateTaskStatus(task);
    
    const statusColor = status.isDone 
        ? 'border-green-400' 
        : status.isToday 
            ? 'border-blue-400' 
            : status.isOverdue 
                ? 'border-red-400' 
                : 'border-yellow-400';

    return (
        <Link to={`/task/${task.id}`} aria-label={`Ouvrir la tâche ${task.title}`}>
            <article className={`card-article ${statusColor}`} role="button">
                <div className="flex-1 min-w-0">
                    <h3 className="card-title">
                        {task.title} {task.project_name ? `- ${task.project_name}` : ''}
                    </h3>
                    {task.dueDate && (
                        <p className="card-subtitle">
                            Date limite : {formatDate(task.dueDate)}
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-end ml-4">
                    <span className="card-status-icon">
                        <StatusIcon status={status} />
                    </span>
                    <StatusBadge status={status} />
                </div>
            </article>
        </Link>
    );
}
