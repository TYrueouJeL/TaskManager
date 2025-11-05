import {useEffect, useState} from "react";
import { supabase } from "../../supabase/supabaseClient.ts";
import TaskCard from "./TaskCard.tsx";
import SearchForm from "../SearchForm.tsx";

export default function TaskList({tasks}) {
    const [search, setSearch] = useState({ title: '' });

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

    return (
        <>
            <div className="flex items-center justify-center mb-4">
                <SearchForm
                    search={search}
                    onSearch={formData => setSearch(formData)}
                    placeholderContent="une tâche"
                    onSubmit={handleFormSubmit}
                    searchChamp="title"
                />
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 my-4 ml-2 mr-2">
                {cards}
            </section>
        </>
    );
}