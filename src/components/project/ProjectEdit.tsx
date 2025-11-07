import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {updateProject} from "../../services/api.ts";

export default function ProjectEdit({ project }: { project: any }) {
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const projectData = {
            title,
            description,
        };
        const { error } = await updateProject(project.id, projectData);
        if (error) {
            console.error('Error updating project:', error);
            return;
        }
        navigate(`/project/${project.id}`);
    }

    return (
        <>
            <div className="project-detail__header">
                <h1 className="project-detail__title">Modifier le projet {title}</h1>
            </div>

            <form onSubmit={handleSubmit} className="project-edit-form">
                <div className="form-group">
                    <label htmlFor="title" className={"form-label"}>Titre</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className={"form-input"}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description" className={"form-label"}>Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={"form-textarea"}
                    />
                </div>

                <button type="submit" className="form-button">Enregistrer les modifications</button>
            </form>
        </>
    );
}