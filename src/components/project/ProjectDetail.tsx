import TaskList from "../task/TaskList.jsx";
import {useEffect, useState} from "react";
import {supabase} from "../../supabase/supabaseClient.ts";

export default function ProjectDetail({ project }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function loadTasks() {
            const { data, error } = await supabase
                .from('task')
                .select('*')
                .order('dueDate', { ascending: true });

            if (error) {
                console.error('Error fetching tasks:', error);
            } else {
                setTasks(data);
            }
        }

        loadTasks();
    }, []);

    if (!project) {
        return <div>Projet non trouvé</div>
    }

    const projectTasks = tasks.filter(task => task.project_id === project.id);

    return (
        <>
            <h1 className={"title"}>Détail du projet : {project.name}</h1>

            <div className="flex flex-row gap-4">
                <article className={"article flex-1"}>
                    <p>{project.description}</p>
                </article>

                <article className={"article flex-1"}>
                    <p>Date de création : {new Date(project.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}</p>
                </article>
            </div>

            <section className="mt-6">
                <TaskList tasks={projectTasks}/>
            </section>
        </>
    );
}