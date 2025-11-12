import { Link, useParams } from 'react-router';
import {RiEditLine, RiDeleteBinLine} from 'react-icons/ri';
import '../../style/ProjectDetail.css';
import type { Task } from '../../db';
import {
    getProject,
    getTasksByProject,
    deleteProject,
    deleteTask,
} from '../../services/api';
import { useDataFetcher } from '../../hooks/useDataFetcher';
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation';
import { formatDate, getTomorrow } from '../../utils/dateUtils';
import LoadingState from '../shared/LoadingState';
import ErrorState from '../shared/ErrorState';
import TaskListItem from '../task/TaskListItem';

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();

    const { data: project, loading, error } = useDataFetcher(
        () => getProject(id!),
        [id]
    );

    const { 
        data: allTasks, 
        loading: tasksLoading, 
        error: tasksError,
        refetch: refetchTasks
    } = useDataFetcher(
        () => getTasksByProject(id!),
        [id]
    );

    const { handleDelete: handleProjectDelete, deleting } = useDeleteConfirmation({
        onDelete: deleteProject,
        redirectPath: '/project/list',
        confirmMessage: 'Supprimer ce projet ? Cette action est irréversible.'
    });

    const { handleDelete: handleTaskDelete } = useDeleteConfirmation({
        onDelete: deleteTask,
        onSuccess: refetchTasks,
        confirmMessage: 'Supprimer cette tâche ?'
    });

    if (loading) return <LoadingState className="project-detail project-detail__container text-sm text-gray-500" />;
    if (error) return <ErrorState message={error} className="project-detail project-detail__container text-sm text-red-600" />;
    if (!project) return <LoadingState message="Projet introuvable." className="project-detail project-detail__container text-sm text-gray-500" />;

    const tasks = (allTasks || []).filter((task: Task) => task.is_daily === false);
    const dailyTasks = (allTasks || []).filter((task: Task) => {
        if (!task.is_daily) return false;
        if (!task.dueDate) return true;
        if (!task.start_date) return false;
        
        if (new Date(task.start_date) > new Date()) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= new Date();
    });

    const tomorrow = getTomorrow();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => Boolean(t.validationDate)).length;
    const pendingTasks = tasks.filter(t => !t.validationDate).length;
    const overdueTasks = tasks.filter(t => {
        if (t.dueDate && !t.validationDate) {
            const d = new Date(t.dueDate);
            return !Number.isNaN(d.getTime()) && d < tomorrow;
        }
        return false;
    }).length;

    return (
        <div className="project-detail">
            <div>
                <div className="project-detail__header">
                    <div>
                        <h1 className="project-detail__title">{project.title}</h1>
                        <p className="project-detail__meta">Créé le {formatDate(project.created_at)}</p>
                    </div>

                    <div className="project-detail__actions">
                        <Link to="/project/list" className="project-detail__link">← Retour</Link>
                        <Link to={`/project/edit/${project.id}`} className="project-detail__link" title="Éditer">
                            <RiEditLine />
                        </Link>
                        <button onClick={() => handleProjectDelete(id!)} disabled={deleting} className="project-detail__link" title="Supprimer">
                            <RiDeleteBinLine className="text-red-500 cursor-pointer" />
                        </button>
                    </div>
                </div>

                <div className={"flex flex-col lg:flex-row gap-4"}>
                    <div className={"w-full lg:w-1/4 flex flex-col gap-3"}>
                        <div className="project-detail__card">
                            <div className="project-detail__description">
                                {project.description ? <p>{project.description}</p> : <p className="text-sm text-gray-500">Aucune description</p>}
                            </div>
                        </div>

                        <div className="project-detail__stats">
                            <div className="project-detail__stat">
                                <div className="label">Tâches totales</div>
                                <div className="value">{totalTasks}</div>
                            </div>
                            <div className="project-detail__stat">
                                <div className="label">Complétées</div>
                                <div className="value" style={{ color: 'var(--accent-success)' }}>{completedTasks}</div>
                            </div>
                            <div className="project-detail__stat">
                                <div className="label">En cours</div>
                                <div className="value">{pendingTasks}</div>
                            </div>
                            <div className="project-detail__stat">
                                <div className="label">En retard</div>
                                <div className="value" style={{ color: 'var(--accent-danger)' }}>{overdueTasks}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="project-detail__tasks h-min">
                            <h2 className="text-lg font-medium mb-3">Tâches</h2>

                            {tasksLoading && <LoadingState message="Chargement des tâches…" />}
                            {tasksError && <ErrorState message={tasksError} />}
                            {!tasksLoading && tasks.length === 0 && <LoadingState message="Aucune tâche pour ce projet." />}

                            <ul className="project-detail__task-list">
                                {tasks.map(task => (
                                    <TaskListItem 
                                        key={task.id} 
                                        task={task} 
                                        onDelete={handleTaskDelete}
                                    />
                                ))}
                            </ul>
                        </div>

                        <div className="project-detail__tasks h-min">
                            <h2 className="text-lg font-medium mb-3">Tâches quotidiennes</h2>

                            {tasksLoading && <LoadingState message="Chargement des tâches…" />}
                            {tasksError && <ErrorState message={tasksError} />}
                            {!tasksLoading && dailyTasks.length === 0 && <LoadingState message="Aucune tâche quotidienne pour ce projet." />}

                            <ul className="project-detail__task-list">
                                {dailyTasks.map(task => (
                                    <TaskListItem 
                                        key={task.id} 
                                        task={task} 
                                        onDelete={handleTaskDelete}
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}