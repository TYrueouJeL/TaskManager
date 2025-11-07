import {createProject, getActualUser} from "../../services/api.ts";
import {useState} from "react";
import {useNavigate} from "react-router";

export default function ProjectCreateForm() {
    const [loading , setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const user_id = (await getActualUser()).id;

        const { data, error } = await createProject({ title, description, user_id });
        if (error) {
            console.error("Error creating project:", error);
            setErrorMessage("Erreur lors de la création du projet.");
            setLoading(false);
            return;
        }
        navigate(`/project/list`);
    };

    return (
        <form onSubmit={handleSubmit} className="project-create-form">
            <div className="form-group">
                <label htmlFor="title" className="form-label">Titre</label>
                <input type="text" id="title" name="title" required className="form-input" />
            </div>

            <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea id="description" name="description" className="form-textarea" required/>
            </div>

            <button type="submit" className="form-button" disabled={loading}>
                {loading ? 'Création…' : 'Créer le projet'}
            </button>

            {errorMessage && <div className="form-error">{errorMessage}</div>}
        </form>
    );
}