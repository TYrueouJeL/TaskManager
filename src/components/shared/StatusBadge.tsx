import type { TaskStatus } from '../../utils/dateUtils';

interface StatusBadgeProps {
    status: TaskStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const { isDone, isToday, isOverdue } = status;
    
    const className = `mt-2 px-2 py-0.5 text-xs rounded-full font-medium ${
        isDone 
            ? 'bg-green-100 text-green-800' 
            : isToday 
                ? 'bg-blue-100 text-blue-800' 
                : isOverdue 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
    }`;
    
    const label = isDone 
        ? 'Terminée' 
        : isToday 
            ? "Aujourd'hui" 
            : isOverdue 
                ? 'En retard' 
                : 'À faire';
    
    return <span className={className}>{label}</span>;
}
