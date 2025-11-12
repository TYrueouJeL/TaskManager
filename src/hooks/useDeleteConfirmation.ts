import { useState } from 'react';
import { useNavigate } from 'react-router';

interface UseDeleteConfirmationOptions {
    onDelete: (id: string) => Promise<{ data?: any; error?: any }>;
    redirectPath?: string;
    confirmMessage?: string;
    onSuccess?: () => void;
}

export function useDeleteConfirmation({
    onDelete,
    redirectPath,
    confirmMessage = 'Voulez-vous vraiment supprimer cet élément ?',
    onSuccess
}: UseDeleteConfirmationOptions) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleDelete = async (id: string) => {
        if (!window.confirm(confirmMessage)) return;

        setDeleting(true);
        setError(null);

        try {
            const res = await onDelete(id);
            if (res.error) throw res.error;

            if (onSuccess) {
                onSuccess();
            }

            if (redirectPath) {
                navigate(redirectPath);
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err ?? 'Erreur lors de la suppression');
            setError(msg);
        } finally {
            setDeleting(false);
        }
    };

    return { handleDelete, deleting, error };
}
