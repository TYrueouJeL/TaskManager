import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { RiCheckLine, RiTimeLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri';
import '../../style/ProjectDetail.css';
import type { Project, Task } from '../../db';
import {
    getProject,
    getTasksByProject,
    deleteProject,
    deleteTask,
    updateTask
} from '../../services/api';

function formatDate(iso?: string | null) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<boolean>(false);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [tasksLoading, setTasksLoading] = useState<boolean>(false);
    const [tasksError, setTasksError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const res = await getProject(id);
                if (!mounted) return;
                if (res.error) throw res.error;
                setProject(res.data ?? null);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err ?? 'Erreur inconnue');
                setError(msg);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, [id]);

    useEffect(() => {
        let mounted = true;
        if (!id) {
            setTasks([]);
            return;
        }
        async function load() {
            setTasksLoading(true);
            setTasksError(null);
            try {
                const res = await getTasksByProject(id);
                if (!mounted) return;
                if (res.error) throw res.error;
                setTasks(res.data ?? []);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err ?? 'Erreur inconnue');
                setTasksError(msg);
            } finally {
                if (mounted) setTasksLoading(false);
            }
        }
        load();
        return () => { mounted = false; };
    }, [id]);

    async function handleDelete() {
        if (!project || !id) return;
        if (!window.confirm('Supprimer ce projet ? Cette action est irréversible.')) return;
        setDeleting(true);
        try {
            const res = await deleteProject(id);
            if (res.error) throw res.error;
            navigate('/project');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err ?? 'Erreur lors de la suppression');
            setError(msg);
        } finally {
            setDeleting(false);
        }
    }

    async function handleDeleteTask(taskId: string) {
        if (!window.confirm('Supprimer cette tâche ?')) return;
        try {
            const res = await deleteTask(taskId);
            if (res.error) throw res.error;
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err ?? 'Erreur lors de la suppression');
            setTasksError(msg);
        }
    }

    async function toggleTaskValidation(t: Task) {
        try {
            const payload = { validationDate: t.validationDate ? null : new Date().toISOString() };
            const res = await updateTask(t.id, payload);
            if (res.error) throw res.error;
            setTasks(prev => prev.map(it => it.id === t.id ? { ...it, validationDate: (payload as any).validationDate } : it));
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err ?? 'Erreur lors de la mise à jour');
            setTasksError(msg);
        }
    }

    if (loading) return <div className="project-detail project-detail__container text-sm text-gray-500">Chargement…</div>;
    if (error) return <div className="project-detail project-detail__container text-sm text-red-600">{error}</div>;
    if (!project) return <div className="project-detail project-detail__container text-sm text-gray-500">Projet introuvable.</div>;

    const now = new Date();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => Boolean(t.validationDate)).length;
    const pendingTasks = tasks.filter(t => !t.validationDate).length;
    const overdueTasks = tasks.filter(t => {
        if (t.dueDate && !t.validationDate) {
            const d = new Date(t.dueDate);
            return !Number.isNaN(d.getTime()) && d < now;
        }
        return false;
    }).length;

    return (
        <div className="project-detail">
            <div className="project-detail__container">
                <div className="project-detail__header">
                    <div>
                        <h1 className="project-detail__title">{project.title}</h1>
                        <p className="project-detail__meta">Créé le {formatDate(project.created_at)}</p>
                    </div>

                    <div className="project-detail__actions">
                        <Link to="/project" className="project-detail__link">← Retour</Link>
                        <Link to={`/project/edit/${project.id}`} className="project-detail__link" title="Éditer">
                            <RiEditLine />
                        </Link>
                        <button onClick={handleDelete} disabled={deleting} className="project-detail__link" title="Supprimer">
                            <RiDeleteBinLine />
                        </button>
                    </div>
                </div>

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

                <div className="project-detail__tasks">
                    <h2 className="text-lg font-medium mb-3">Tâches</h2>

                    {tasksLoading && <div className="text-sm text-gray-500">Chargement des tâches…</div>}
                    {tasksError && <div className="text-sm text-red-600">{tasksError}</div>}
                    {!tasksLoading && tasks.length === 0 && <div className="text-sm text-gray-500">Aucune tâche pour ce projet.</div>}

                    <ul className="project-detail__task-list">
                        {tasks.map(task => {
                            const done = Boolean(task.validationDate);
                            const overdue = !done && task.dueDate && (() => {
                                const d = new Date(task.dueDate!);
                                return !Number.isNaN(d.getTime()) && d < now;
                            })();

                            const itemClass = [
                                'project-detail__task-item',
                                done ? 'project-detail__task-done' : '',
                                overdue ? 'project-detail__task-overdue' : ''
                            ].join(' ').trim();

                            return (
                                <li key={task.id} className={itemClass} tabIndex={0}>
                                    <div className="project-detail__task-info">
                                        <button onClick={() => toggleTaskValidation(task)} aria-label="toggle validation" className="icon-btn">
                                            {done ? <RiCheckLine className="project-detail__icon--done" /> : <RiTimeLine className="project-detail__icon--pending" />}
                                        </button>
                                        <div>
                                            <div className="project-detail__task-title">{task.title}</div>
                                            <div className="project-detail__task-due">Échéance : {formatDate(task.dueDate)}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {overdue && <span className="project-detail__overdue-badge">En retard</span>}
                                        <Link to={`/task/edit/${task.id}`} className="project-detail__link" title="Éditer">
                                            <RiEditLine />
                                        </Link>
                                        <button onClick={() => handleDeleteTask(task.id)} className="project-detail__link" title="Supprimer">
                                            <RiDeleteBinLine />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}