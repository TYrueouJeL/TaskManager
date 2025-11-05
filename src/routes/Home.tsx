import { Link } from 'react-router';
import { RiCheckboxCircleLine, RiFolderOpenLine, RiAddLine, RiListUnordered, RiSearchLine } from 'react-icons/ri';
import {useEffect, useState} from "react";
import {supabase} from "../supabase/supabaseClient.ts";
import TaskList from "../components/task/TaskList.tsx";
import ProjectList from "../components/project/ProjectList.tsx";

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function loadData() {
            const { data: tasksData, error: tasksError } = await supabase
                .from('task')
                .select('*')
                .order('dueDate', { ascending: true });

            const { data: projectsData, error: projectsError } = await supabase
                .from('project')
                .select('*')
                .order('created_at', { ascending: false });

            if (tasksError) {
                console.error('Error fetching tasks:', tasksError);
            } else {
                setTasks(tasksData);
            }

            if (projectsError) {
                console.error('Error fetching projects:', projectsError);
            } else {
                setProjects(projectsData);
            }
        }

        loadData();
    })

    const taskCount = tasks.length;
    const projectCount = projects.length

    const recentTasks = tasks.filter(task => !task.validationDate).slice(0, 4);
    const recentProjects = projects.slice(0, 3);

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* En-tête */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold">Tableau de bord</h1>
                    <p className="text-sm text-gray-500">Vue d'ensemble de vos projets et tâches — accédez rapidement à ce qui compte.</p>
                </div>
            </header>

            {/* Grille principale */}
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne gauche : stats & actions */}
                <section className="lg:col-span-1 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/task" className="card-button p-4 flex flex-col">
                            <div className="flex items-center gap-3">
                                <RiCheckboxCircleLine className="text-2xl text-green-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Tâches</p>
                                    <p className="text-xl font-medium">{taskCount}</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">À faire / complétées</p>
                        </Link>

                        <Link to="/project" className="card-button p-4 flex flex-col">
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

                    <div className="card p-4">
                        <h2 className="font-semibold mb-2">Raccourcis</h2>
                        <nav className="flex flex-col gap-2 text-sm">
                            <Link to="/task" className="text-gray-700 hover:underline flex items-center gap-2"><RiListUnordered /> Toutes les tâches</Link>
                            <Link to="/project" className="text-gray-700 hover:underline flex items-center gap-2"><RiFolderOpenLine /> Tous les projets</Link>
                        </nav>
                    </div>
                </section>

                {/* Colonne droite : aperçus récents (grande) */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="card p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold">Tâches récentes</h2>
                            <Link to="/task" className="text-sm text-blue-600 hover:underline flex items-center gap-1"><RiSearchLine /> Voir tout</Link>
                        </div>

                        <ul className="space-y-3">
                            <TaskList tasks={recentTasks} />
                        </ul>
                    </div>

                    <div className="card p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold">Projets récents</h2>
                            <Link to="/project" className="text-sm text-blue-600 hover:underline flex items-center gap-1"><RiSearchLine /> Voir tout</Link>
                        </div>

                        <ul className="space-y-3">
                            <ProjectList projects={recentProjects} />
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}
