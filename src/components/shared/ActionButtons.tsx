import { Link } from 'react-router';
import { RiEditLine, RiDeleteBinLine } from 'react-icons/ri';
import { FaEye } from 'react-icons/fa';

interface ActionButtonsProps {
    id: string;
    entityType: 'task' | 'project';
    onDelete?: () => void;
    showView?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
}

export default function ActionButtons({
    id,
    entityType,
    onDelete,
    showView = true,
    showEdit = true,
    showDelete = true
}: ActionButtonsProps) {
    return (
        <div className="flex items-center gap-2">
            {showEdit && (
                <Link to={`/${entityType}/edit/${id}`} title="Éditer">
                    <RiEditLine className="cursor-pointer" />
                </Link>
            )}
            
            {showDelete && onDelete && (
                <button onClick={onDelete} title="Supprimer">
                    <RiDeleteBinLine className="text-red-500 cursor-pointer" />
                </button>
            )}
            
            {showView && entityType === 'task' && (
                <Link to={`/task/${id}`} title="Détail">
                    <FaEye className="text-blue-500 cursor-pointer" />
                </Link>
            )}
        </div>
    );
}
