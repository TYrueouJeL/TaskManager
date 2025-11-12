import { Link } from 'react-router';
import StatusIcon from '../shared/StatusIcon';
import ActionButtons from '../shared/ActionButtons';
import { calculateTaskStatus, formatDate } from '../../utils/dateUtils';
import type { Task } from '../../db';

interface TaskListItemProps {
    task: Task;
    onDelete?: (taskId: string) => void;
    showActions?: boolean;
}

export default function TaskListItem({ task, onDelete, showActions = true }: TaskListItemProps) {
    const status = calculateTaskStatus(task);
    
    const itemClass = [
        'project-detail__task-item',
        status.isDone ? 'project-detail__task-done' : '',
        status.isToday ? 'project-detail__task-today' : '',
        status.isOverdue ? 'project-detail__task-overdue' : ''
    ].filter(Boolean).join(' ');

    const iconClass = status.isDone 
        ? 'project-detail__icon--done' 
        : status.isToday 
            ? 'project-detail__icon--info' 
            : 'project-detail__icon--pending';

    return (
        <li className={itemClass} tabIndex={0}>
            <div className="project-detail__task-info flex items-center gap-2">
                <StatusIcon status={status} />
                
                <div className="flex-1 min-w-0">
                    <div className="project-detail__task-title">{task.title}</div>
                    <div className="project-detail__task-due text-sm text-gray-500">
                        Échéance : {formatDate(task.dueDate)}
                    </div>
                </div>
            </div>

            {showActions && (
                <div className="mt-2 lg:mt-0">
                    <ActionButtons
                        id={task.id}
                        entityType="task"
                        onDelete={onDelete ? () => onDelete(task.id) : undefined}
                    />
                </div>
            )}
        </li>
    );
}
