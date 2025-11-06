import ProjectCard from "./ProjectCard.jsx";
import SearchForm from "../SearchForm.jsx";
import {useState} from "react";
import {Link} from "react-router";

export default function ProjectList({ projects }) {
    const [search, setSearch] = useState({ title: '' });

    if (!projects) {
        return <div>Chargement...</div>;
    }

    const filteredProjects = projects.filter(project => {
        const title = project.title.toLowerCase();
        const searchTitle = search.title.toLowerCase();
        return title.includes(searchTitle);
    });

    const handleFormSubmit = (event) => {
        event.preventDefault();
    }

    const cards = filteredProjects.map(project => <ProjectCard key={project.id} project={project}/>);

    return (
        <>
            <div className="flex items-center justify-center mb-4">
                <SearchForm
                    search={search}
                    onSearch={formData => setSearch(formData)}
                    placeholderContent="projets"
                    onSubmit={handleFormSubmit}
                    searchChamp="title"
                />

                <Link to={`/project/create`} className={"create-button"}>Nouveau projet</Link>
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 my-4 ml-2 mr-2">
                {cards}
            </section>
        </>
    );
}