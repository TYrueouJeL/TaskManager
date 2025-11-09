import { useState } from "react";
import SearchForm from "../SearchForm.tsx";
import TaskCard from "./TaskCard.tsx";
import { Link } from "react-router";

export default function TaskList({ tasks }) {
    const [search, setSearch] = useState({ title: "" });
    const [filters, setFilters] = useState({
        hideCompleted: false,
        startDate: "",
        endDate: "",
        projectFilter: "all" // all | with | without
    });

    if (!tasks) return <div>Chargement...</div>;

    const handleFormSubmit = (e) => e.preventDefault();

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const filteredTasks = tasks.filter((task) => {
        const title = task.title.toLowerCase();
        const searchTitle = search.title.toLowerCase();

        const matchesSearch = title.includes(searchTitle);
        const matchesCompletion = !filters.hideCompleted || !task.validationDate;

        // Dates
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const startDate = filters.startDate ? new Date(filters.startDate) : null;
        const endDate = filters.endDate ? new Date(filters.endDate) : null;

        const matchesDate =
            (!startDate || (dueDate && dueDate >= startDate)) &&
            (!endDate || (dueDate && dueDate <= endDate));

        // Projet
        const matchesProject =
            filters.projectFilter === "all" ||
            (filters.projectFilter === "with" && task.project_id) ||
            (filters.projectFilter === "without" && !task.project_id);

        return matchesSearch && matchesCompletion && matchesDate && matchesProject;
    });

    const cards = filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
    ));

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-6 mb-6">
                {/* 🔍 Barre de recherche et bouton */}
                <div className="flex flex-wrap items-center justify-center gap-4 w-full px-4">
                    <SearchForm
                        search={search}
                        onSearch={(formData) => setSearch(formData)}
                        placeholderContent="une tâche"
                        onSubmit={handleFormSubmit}
                        searchChamp="title"
                    />

                    <Link
                        to="/task/create"
                        className="create-button"
                    >
                        Nouvelle tâche
                    </Link>
                </div>

                {/* 🎛️ Filtres graphiques */}
                <div className="filter">
                    <h3>
                        Filtres
                    </h3>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
                        {/* ✅ Cacher tâches validées */}
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    name="hideCompleted"
                                    checked={filters.hideCompleted}
                                    onChange={handleFilterChange}
                                    className="w-4 h-4 accent-blue-600"
                                />
                                Cacher les tâches validées
                            </label>
                        </div>

                        {/* 🗓️ Période */}
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <label>Du :</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="filter-input"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <label>Au :</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="filter-input"
                            />
                        </div>

                        {/* 📁 Filtre projet */}
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <label>Projet :</label>
                            <select
                                name="projectFilter"
                                value={filters.projectFilter}
                                onChange={handleFilterChange}
                                className="filter-input"
                            >
                                <option value="all">Tous</option>
                                <option value="with">Avec projet</option>
                                <option value="without">Sans projet</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 my-4 ml-2 mr-2">
                {cards.length > 0 ? (
                    cards
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        Aucune tâche trouvée.
                    </p>
                )}
            </section>
        </>
    );
}
