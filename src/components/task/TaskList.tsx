import {useEffect, useState} from "react";
import { supabase } from "../../supabase/supabaseClient.ts";
import TaskCard from "./TaskCard.tsx";
import SearchForm from "../SearchForm.tsx";

export default function TaskList() {
    const [search, setSearch] = useState({ title: '' });
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

    if (!tasks) {
        return <div>Chargement...</div>;
    }

    if (tasks.length === 0) {
        return <div>Aucune tâche trouvée.</div>;
    }

    const filteredTasks = tasks.filter(task => {
        const title = task.title.toLowerCase();
        const searchTitle = search.title.toLowerCase();

        return title.includes(searchTitle);
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
    }

    const cards = filteredTasks.map(task => <TaskCard key={task.id} task={task} />);

    const finishedTasks = filteredTasks.filter(task => task.validationDate != null);
    const unfinishedTasks = filteredTasks.filter(task => task.validationDate === null);
    const overdueTasks = filteredTasks.filter(task => new Date(task.dueDate) < new Date() && task.validationDate === null);

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className={"title"}>Liste des tâches</h1>

                <SearchForm
                    search={search}
                    onSearch={formData => setSearch(formData)}
                    placeholderContent="une tâche"
                    onSubmit={handleFormSubmit}
                    searchChamp="title"
                />
            </div>

            <div className={'flex gap-4 items-center mb-4'}>
                <h1>{finishedTasks.length} Tâche(s) terminée(s)</h1>
                <h1>{unfinishedTasks.length} Tâche(s) en cours</h1>
                <h1>{overdueTasks.length} Tâches(s) en retard</h1>
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 my-4 ml-2 mr-2">
                {cards}
            </section>
        </>
    );
}