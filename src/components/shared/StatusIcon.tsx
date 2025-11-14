import { RiCheckLine, RiTimeLine, RiCloseLine } from 'react-icons/ri';
import type { TaskStatus } from '../../utils/dateUtils';

interface StatusIconProps {
    status: TaskStatus;
    size?: 'sm' | 'md' | 'lg';
}

export default function StatusIcon({ status, size = 'md' }: StatusIconProps) {
    const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : '';
    
    if (status.isDone) {
        return <RiCheckLine className={`text-green-500 ${sizeClass}`} />;
    }

    if (status.isToday) {
        return <RiTimeLine className={`text-blue-500 ${sizeClass}`} />;
    }
    
    if (status.isOverdue) {
        return <RiCloseLine className={`text-red-500 ${sizeClass}`} />;
    }
    
    return <RiTimeLine className={`text-yellow-500 ${sizeClass}`} />;
}
