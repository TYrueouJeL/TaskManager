import {Link, useNavigate, useParams} from "react-router";
import {RiEditLine, RiDeleteBinLine, RiFolderOpenLine} from 'react-icons/ri';
import {deleteTask, getTask, unvalidateTask, validateTask, getTaskDependencies} from "@/services/api.ts";
import {FaCheck, FaX} from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TaskCard from "./TaskCard.tsx";
import { useDataFetcher } from '@/hooks/useDataFetcher.ts';
import { formatDate, calculateTaskStatus } from '@/utils/dateUtils.ts';
import LoadingState from '../shared/LoadingState';
import ErrorState from '../shared/ErrorState';
import StatusIcon from '../shared/StatusIcon';

export default function TaskDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: task, loading, error, refetch } = useDataFetcher(
        async () => {
            const { data: taskData, error: taskError } = await getTask(id!);
            if (taskError) throw taskError;
            
            const { data: depsData, error: depsError } = await getTaskDependencies(taskData.id);
            if (depsError) throw depsError;
            
            return { data: { ...taskData, dependencies: depsData } };
        },
        [id]
    );

    const handleValidate = async () => {
        if (!task) return;
        await validateTask(task.id);
        refetch();
    }

    const handleUnValidate = async () => {
        if (!task) return;
        await unvalidateTask(task.id);
        refetch();
    }

    const handleDelete = async () => {
        if (!task || !window.confirm('Supprimer cette tâche ?')) return;
        const { error } = await deleteTask(task.id);
        if (!error) {
            navigate('/task/list');
        }
    }

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!task) return <LoadingState message="Tâche introuvable." />;

    const status = calculateTaskStatus(task);
    const dependencies = task.dependencies || [];

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{task.title} {task.project_name ? `- ${task.project_name}` : ''}</h1>
                    <p className="text-sm text-gray-500 mt-1">Créée le {formatDate(task.created_at)}</p>
                </div>

                <div className={"flex items-center justify-center gap-2"}>
                    {task.project_id ?
                        <Link to={`/project/${task.project_id}`}>
                            <RiFolderOpenLine className={"text-blue-500 cursor-pointer"}/>
                        </Link> : null
                    }

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
                        <StatusIcon status={status} />
                        <span className="text-sm text-gray-700">{status.isDone ? 'Validée' : 'À faire'}</span>
                    </div>
                    <div className="text-sm text-gray-500">Échéance : {formatDate(task.dueDate)}</div>
                </div>

                <div className="task-detail-description max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {task.description || "*Aucune description*"}
                    </ReactMarkdown>
                </div>

                {dependencies.length > 0 ? (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-2">Tâches prérequises</h2>
                        {dependencies
                            .map((dep: any) => dep.predecessor_task)
                            .filter(Boolean)
                            .map((t: any) => (
                                <div className={"mt-4"}>
                                    <TaskCard key={t.id} task={t} />
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 mt-4">Aucune dépendance.</p>
                )}

            </div>
        </div>
    );
}