import ProjectList from "../../components/project/ProjectList.tsx";
import {useEffect, useState} from "react";
import {getProjects} from "../../services/api.ts";

export default function Project() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function loadProjects() {
            const { data, error } = await getProjects()

            if (error) {
                console.error('Error fetching projects:', error);
            } else {
                setProjects(data);
            }
        }

        loadProjects();
    }, []);

    return (
        <>
            <div className="flex flex-col items-center justify-center mb-4">
                <h1 className="text-4xl font-bold mb-4">Gestion des Projets</h1>
                <p className="text-lg text-gray-600">Ici, vous pouvez gérer vos projets.</p>
            </div>

            <ProjectList projects={projects} />
        </>
    )
}