interface ErrorStateProps {
    message: string;
    className?: string;
}

export default function ErrorState({ 
    message, 
    className = 'text-sm text-red-600' 
}: ErrorStateProps) {
    return <div className={className}>{message}</div>;
}
