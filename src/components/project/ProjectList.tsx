import ProjectCard from "./ProjectCard.jsx";
import SearchForm from "../SearchForm.jsx";
import {useEffect, useState} from "react";
import {supabase} from "../../supabase/supabaseClient.ts";

export default function ProjectList() {
    const [search, setSearch] = useState({ title: '' });
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function loadProjects() {
            const { data, error } = await supabase
                .from('project')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching projects:', error);
            } else {
                setProjects(data);
            }
        }

        loadProjects();
    }, []);

    if (!projects || projects.length === 0) {
        return <p className="text-gray-500">Aucun projet trouvé.</p>;
    }

    const filteredProjects = projects.filter(project => {
        const title = project.title.toLowerCase();
        const searchTitle = search.title.toLowerCase();
        return title.includes(searchTitle);
    });

    const handleFormSubmit = (event) => {
        event.preventDefault();
    }

    const cards = filteredProjects.map(project => <ProjectCard key={project.id} project={project} />);

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className={"title"}>Liste des projets</h1>

                <SearchForm
                    search={search}
                    onSearch={formData => setSearch(formData)}
                    placeholderContent="projets"
                    onSubmit={handleFormSubmit}
                    searchChamp="title"
                />
            </div>

            <h1>{filteredProjects.length} Projet(s)</h1>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 my-4 ml-2 mr-2">
                {cards}
            </section>
        </>
    );
}