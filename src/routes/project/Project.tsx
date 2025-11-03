import ProjectList from "../../components/project/ProjectList.tsx";

export default function Project() {
    return (
        <>
            <div className="flex flex-col items-center justify-center mb-4">
                <h1 className="text-4xl font-bold mb-4">Gestion des Projets</h1>
                <p className="text-lg text-gray-600">Ici, vous pouvez gérer vos projets.</p>
            </div>

            <ProjectList />
        </>
    )
}