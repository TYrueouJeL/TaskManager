interface LoadingStateProps {
    message?: string;
    className?: string;
}

export default function LoadingState({ 
    message = 'Chargement…', 
    className = 'text-sm text-gray-500' 
}: LoadingStateProps) {
    return <div className={className}>{message}</div>;
}
