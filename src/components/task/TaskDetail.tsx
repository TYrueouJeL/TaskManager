import { useEffect, useState } from 'react';
import {Link, useNavigate, useParams} from "react-router";
import {RiCheckLine, RiDeleteBinLine, RiEditLine, RiTimeLine} from 'react-icons/ri';
import {deleteTask, getTask, unvalidateTask, validateTask, getTaskDependencies} from "../../services/api.ts";
import {FaCheck, FaX} from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TaskList from "./TaskList.tsx";
import TaskCard from "./TaskCard.tsx";

function formatDate(iso?: string | null) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function TaskDetail() {
    const { id } = useParams<{ id: string }>();

    const [task, setTask] = useState(null);
    const [taskDependencies, setTaskDependencies] = useState(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                const { data: taskData, error: taskError } = await getTask(id!);
                if (taskError) throw new Error("Erreur lors du chargement de la tâche.");
                if (!isMounted) return;

                setTask(taskData);

                const { data: depsData, error: depsError } = await getTaskDependencies(taskData.id);
                if (depsError) throw new Error("Erreur lors du chargement des dépendances.");

                if (isMounted) {
                    console.log(depsData);
                    setTaskDependencies(depsData);
                }
            } catch (err: any) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleValidate = async () => {
        if (!task) return;
        setLoading(true);
        const { data, error } = await validateTask(task.id);
        if (error) {
            setError('Erreur lors de la validation de la tâche.');
        } else {
            setTask(data);
        }
        navigate(0);
    }

    const handleUnValidate = async () => {
        if (!task) return;
        setLoading(true);
        const { data, error } = await unvalidateTask(task.id);
        if (error) {
            setError('Erreur lors de l\'annulation de la validation de la tâche.');
        } else {
            setTask(data);
        }
        navigate(0);
    }

    const handleDelete = async () => {
        if (!task) return;
        setLoading(true);
        const { data, error } = await deleteTask(task.id);
        if (error) {
            setError('Erreur lors de la suppression de la tâche.');
        } else {
            navigate('/task/list');
        }
        setLoading(false);
    }

    if (loading) return <div className="text-sm text-gray-500">Chargement…</div>;
    if (error) return <div className="text-sm text-red-600">{error}</div>;
    if (!task) return <div className="text-sm text-gray-500">Tâche introuvable.</div>;

    const validated = Boolean(task.validationDate);
    const statusIcon = validated ? <RiCheckLine className="text-green-500" /> : <RiTimeLine className="text-yellow-500" />;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{task.title} {task.project_name ? `- ${task.project_name}` : ''}</h1>
                    <p className="text-sm text-gray-500 mt-1">Créée le {formatDate(task.created_at)}</p>
                </div>

                <div className={"flex items-center justify-center gap-2"}>
                    <Link to={`/task/edit/${task.id}`} title="Éditer">
                        <RiEditLine />
                    </Link>

                    {task.validationDate == null ? (
                        <button className="text-green-500 cursor-pointer" onClick={handleValidate} title="Valider la tâche">
                            <FaCheck />
                        </button>
                        ) :
                        <button className="text-red-500 cursor-pointer" onClick={handleUnValidate} title="Annuler la validation">
                            <FaX />
                        </button>
                    }

                    <button className="text-red-500 cursor-pointer" onClick={handleDelete} title="Supprimer">
                        <RiDeleteBinLine />
                    </button>
                </div>
            </div>

            <div className="card p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {statusIcon}
                        <span className="text-sm text-gray-700">{validated ? 'Validée' : 'À faire'}</span>
                    </div>
                    <div className="text-sm text-gray-500">Échéance : {formatDate(task.dueDate)}</div>
                </div>

                <div className="task-detail-description max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {task.description || "*Aucune description*"}
                    </ReactMarkdown>
                </div>

                {taskDependencies && taskDependencies.length > 0 ? (
                    <div className="mt-6">
                        {/* Tâches prérequises */}
                        <h2 className="text-lg font-semibold mb-2">Tâches prérequises</h2>
                        {taskDependencies
                            .map((dep: any) => dep.predecessor_task)
                            .filter(Boolean)
                            .map((t: any) => (
                                <TaskCard key={t.id} task={t} />
                            ))}

                    </div>
                ) : (
                    <p className="text-sm text-gray-500 mt-4">Aucune dépendance.</p>
                )}

            </div>
        </div>
    );
}