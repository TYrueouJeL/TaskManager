import { useEffect, useState } from 'react';

interface UseDataFetcherResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useDataFetcher<T>(
    fetchFn: () => Promise<{ data?: T; error?: any }>,
    dependencies: any[] = []
): UseDataFetcherResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        let mounted = true;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetchFn();
                if (!mounted) return;
                if (res.error) throw res.error;
                setData(res.data ?? null);
            } catch (err: unknown) {
                if (!mounted) return;
                const msg = err instanceof Error ? err.message : String(err ?? 'Erreur inconnue');
                setError(msg);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, [...dependencies, refetchTrigger]);

    const refetch = () => setRefetchTrigger(prev => prev + 1);

    return { data, loading, error, refetch };
}
