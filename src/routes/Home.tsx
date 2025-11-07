// src/routes/Home.tsx
import { Link } from 'react-router';
import { RiCheckboxCircleLine, RiFolderOpenLine, RiAddLine, RiSearchLine } from 'react-icons/ri';
import { useEffect, useState } from "react";
import type { Task, Project } from '../db.ts';
import {getTasks, getProjects} from "../services/api.ts";

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        async function loadData() {
            const { data: taskData, error: taskError } = await getTasks();
            if (taskError) {
                console.error('Error fetching tasks:', taskError);
            } else {
                setTasks(taskData);
            }

            const { data: projectData, error: projectError } = await getProjects();
            if (projectError) {
                console.error('Error fetching projects:', projectError);
            } else {
                setProjects(projectData);
            }
        }

        loadData();
    }, []);

    const taskCount = tasks.length;
    const projectCount = projects.length;

    const getTaskStatus = (t: Task) => {
        if (t.validationDate) return 'Terminée';
        if (!t.dueDate) return 'Sans date';

        const due = new Date(t.dueDate);
        const now = new Date();

        const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
        const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        if (dueDay === nowDay) return "Aujourd'hui";
        if (dueDay < nowDay) return "En retard";
        return "En cours";
    };

    const upcomingTasks = tasks
        .filter(task => !task.validationDate && !task.completed)
        .sort((a, b) => {
            const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
            const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
            return da - db;
        })
        .slice(0, 4);

    const ongoingProjects = projects
        .filter(p => !p.archived)
        .slice(0, 3);

    const projectCompletion = (project: Project) => {
        const pid = project.id;
        const related = tasks.filter(t => {
            const pId = t.projectId ?? t.project_id;
            return pId !== undefined && pId !== null && `${pId}` === `${pid}`;
        });
        const total = related.length || (project.task_count ?? 0) || 0;
        const done = related.filter(t => t.validationDate || t.completed).length;
        const percent = total === 0 ? 0 : Math.round((done / total) * 100);
        return { total, done, percent };
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold">Tableau de bord</h1>
                    <p className="text-sm text-gray-500">Vue d'ensemble de vos projets et tâches — accédez rapidement à ce qui compte.</p>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-1 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/task/list" className="card-button p-4 flex flex-col">
                            <div className="flex items-center gap-3">
                                <RiCheckboxCircleLine className="text-2xl text-green-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Tâches</p>
                                    <p className="text-xl font-medium">{taskCount}</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">À faire / complétées</p>
                        </Link>

                        <Link to="/project/list" className="card-button p-4 flex flex-col">
                            <div className="flex items-center gap-3">
                                <RiFolderOpenLine className="text-2xl text-blue-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Projets</p>
                                    <p className="text-xl font-medium">{projectCount}</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Actifs / archivés</p>
                        </Link>
                    </div>

                    <div className="card p-4">
                        <h2 className="font-semibold mb-2">Actions rapides</h2>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link to="/task/create" className="btn btn-primary flex items-center gap-2">
                                <RiAddLine /> Nouvelle tâche
                            </Link>
                            <Link to="/project/create" className="btn btn-outline flex items-center gap-2">
                                <RiAddLine /> Nouveau projet
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="lg:col-span-2 space-y-6">
                    <div className="card p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-lg flex items-center gap-2"><RiSearchLine /> Tâches à venir</h2>
                            <Link to="/task/list" className="text-sm text-blue-600 hover:underline">Voir toutes</Link>
                        </div>

                        {upcomingTasks.length === 0 ? (
                            <p className="text-sm text-gray-500">Aucune tâche à venir.</p>
                        ) : (
                            <ul className="space-y-3">
                                {upcomingTasks.map(task => {
                                    const status = getTaskStatus(task);
                                    return (
                                        <Link to={`/task/${task.id}`} key={task.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="card-title">
                                                    {task.title ?? 'Sans titre'}
                                                </p>
                                                <div className="card-subtitle">
                                                    {task.project_name ? `${task.project_name} • ` : ''}
                                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Pas de date'}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm text-gray-400">{task.priority ?? ''}</div>
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                    status === 'Terminée' ? 'bg-green-100 text-green-700' :
                                                        status === "Aujourd'hui" ? 'bg-blue-100 text-blue-700' :
                                                            status === 'En retard' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {status}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <div className="card p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-lg">Projets en cours</h2>
                            <Link to="/project/list" className="text-sm text-blue-600 hover:underline">Voir tous</Link>
                        </div>

                        {ongoingProjects.length === 0 ? (
                            <p className="text-sm text-gray-500">Aucun projet en cours.</p>
                        ) : (
                            <ul className="space-y-3">
                                {ongoingProjects.map(project => {
                                    const { percent, done, total } = projectCompletion(project);
                                    const name = project.name ?? project.title ?? 'Nom du projet';
                                    return (
                                        <Link to={`/project/${project.id}`} key={project.id} className="flex items-center justify-between">
                                            <div className="w-3/4">
                                                <p className="card-title">
                                                    {name}
                                                </p>
                                                <div className="card-subtitle">
                                                    {project.description ? `${project.description}` : ''}
                                                </div>

                                                <div className="mt-3">
                                                    <div className="card-progress">
                                                        <div
                                                            style={{ width: `${percent}%` }}
                                                            aria-valuenow={Math.round(percent)}
                                                            aria-valuemin={0}
                                                            aria-valuemax={100}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {total > 0 ? `${done}/${total} tâches — ${percent}%` : (project.task_count ? `${project.task_count} tâches` : '0 tâches')}
                                                </div>
                                            </div>

                                            <div className="text-xs text-gray-400">
                                                {percent}%
                                            </div>
                                        </Link>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
