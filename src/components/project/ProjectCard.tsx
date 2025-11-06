import { Link } from 'react-router';
import {useEffect, useState} from "react";
import {supabase} from "../../supabase/supabaseClient.ts";

export default function ProjectCard({ project }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function loadTasks() {
            const {data, error} = await supabase
                .from('task')
                .select('*')
                .eq('project_id', project.id);

            if (error) {
                console.error('Error fetching tasks:', error);
            } else {
                setTasks(data);
            }
        }

        loadTasks();
    }, []);

    const completedTasks = tasks.filter(task => task.validationDate != null).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <Link to={`/project/${project.id}`}>
            <article className="project-card-article">
                <header className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="card-title">
                            {project.title}
                        </h2>
                        <div className="card-subtitle">
                            {totalTasks} tâche{totalTasks !== 1 ? 's' : ''} • {completedTasks} complétée{completedTasks !== 1 ? 's' : ''}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="card-icon">
                            Projet
                        </span>
                    </div>
                </header>

                <div className="card-description">
                    {project.description ?? 'Pas de description.'}
                </div>

                <div className="mt-3">
                    <div className="card-progress">
                        <div
                            style={{ width: `${progress}%` }}
                            aria-valuenow={Math.round(progress)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                    <div className="card-progress-footer">
                        <span>{Math.round(progress)}%</span>
                        <span>{completedTasks}/{totalTasks} terminée{completedTasks !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </article>
        </Link>
    );
}