import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProject, updateProject, getActualUser } from "@/services/api.ts";

interface ProjectFormProps {
    mode: "create" | "edit";
    project?: { id: string; title: string; description: string };
}

export default function ProjectForm({ mode, project }: ProjectFormProps) {
    const navigate = useNavigate();
    const isEdit = mode === "edit";

    const [title, setTitle] = useState(project?.title || "");
    const [description, setDescription] = useState(project?.description || "");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);

        try {
            if (isEdit && project?.id) {
                const { error } = await updateProject(project.id, { title, description });
                if (error) throw new Error(error.message);
                navigate(`/project/${project.id}`);
            } else {
                const user = await getActualUser();
                const { data, error } = await createProject({ title, description, user_id: user?.id });
                if (error) throw new Error(error.message);
                navigate("/project/list");
            }
        } catch (err: any) {
            console.error(err);
            setErrorMessage("Une erreur est survenue lors de l'enregistrement du projet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Modifier le projet" : "Créer un projet"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block mb-1 font-medium text-sm">Titre</label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block mb-1 font-medium text-sm">Description</label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                        />
                    </div>

                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                    <Button type="submit" disabled={loading}>
                        {loading ? (isEdit ? "Enregistrement…" : "Création…") : (isEdit ? "Enregistrer" : "Créer le projet")}
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
    }
