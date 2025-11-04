import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { RiCheckLine, RiCloseLine, RiEditLine, RiDeleteBinLine, RiTimeLine } from 'react-icons/ri';
import { supabase } from '../../supabase/supabaseClient.ts';

function formatDate(iso?: string | null) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function TaskDetail() {
    const { id } = useParams<{ id: string }>();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await supabase
                    .from('task')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (!mounted) return;

                if (res.error) throw res.error;
                setTask(res.data ?? null);
            } catch (err: any) {
                setError(err?.message ?? 'Erreur lors du chargement de la tâche');
            } finally {
                if (mounted) setLoading(false);
            }
        }

        if (id) load();
        return () => { mounted = false; };
    }, [id]);

    if (loading) return <div className="text-sm text-gray-500">Chargement…</div>;
    if (error) return <div className="text-sm text-red-600">{error}</div>;
    if (!task) return <div className="text-sm text-gray-500">Tâche introuvable.</div>;

    const validated = Boolean(task.validationDate);
    const statusIcon = validated ? <RiCheckLine className="text-green-500" /> : <RiTimeLine className="text-yellow-500" />;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{task.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">Créée le {formatDate(task.created_at)}</p>
                </div>

                <Link to={`/task/edit/${task.id}`} title="Éditer">
                    <RiEditLine />
                </Link>
            </div>

            <div className="card p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {statusIcon}
                        <span className="text-sm text-gray-700">{validated ? 'Validée' : 'En cours'}</span>
                    </div>
                    <div className="text-sm text-gray-500">Échéance : {formatDate(task.dueDate)}</div>
                </div>

                <div className="prose max-w-none">
                    <p>{task.description}</p>
                </div>
            </div>
        </div>
    );
}