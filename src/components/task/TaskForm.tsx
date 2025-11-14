import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import MDEditor from "@uiw/react-md-editor";
import { CheckCircle, Circle, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    getProjects,
    getTasksByProject,
    getTaskDependencies,
    addTaskDependency,
    removeTaskDependency,
    createTask,
    updateTask,
    getActualUser
} from "@/services/api.ts";
import { supabase } from "@/supabase/supabaseClient.ts";
import type { Project, Task } from "@/db.ts";

interface TaskFormProps {
    task?: Task;
    mode: "create" | "edit";
}

export default function TaskForm({ task, mode }: TaskFormProps) {
    const navigate = useNavigate();
    const isEdit = mode === "edit";

    // ---------- États ----------
    const [projects, setProjects] = useState<Project[]>([]);
    const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
    const [existingDependencies, setExistingDependencies] = useState<any[]>([]);
    const [dependencyIds, setDependencyIds] = useState<Set<string>>(new Set());

    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [projectId, setProjectId] = useState(task?.project_id || "");
    const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split("T")[0] : "");
    const [startDate, setStartDate] = useState(task?.start_date ? task.start_date.split("T")[0] : "");
    const [isDaily, setIsDaily] = useState(task?.is_daily || false);

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    // ---------- Fetch projets ----------
    useEffect(() => {
        (async () => {
            const { data, error } = await getProjects();
            if (!error) setProjects(data || []);
        })();
    }, []);

    // ---------- Fetch tâches et dépendances ----------
    useEffect(() => {
        if (!projectId) {
            setAvailableTasks([]);
            setDependencyIds(new Set());
            return;
        }

        let cancelled = false;
        (async () => {
            // Tâches du projet (hors la tâche courante si édition)
            const { data: tasks } = await getTasksByProject(projectId);
            if (!cancelled) {
                const filtered = (tasks || []).filter(t => t.id !== task?.id);
                setAvailableTasks(filtered);
            }

            // Dépendances existantes (édition)
            if (isEdit && task?.id) {
                const { data: deps } = await getTaskDependencies(task.id);
                if (!cancelled && deps) {
                    setExistingDependencies(deps);
                    setDependencyIds(new Set(deps.map(d => d.predecessor_task_id)));
                }
            }
        })();

        return () => { cancelled = true; };
    }, [projectId, task, isEdit]);

    // ---------- Filtrage des tâches ----------
    const filteredTasks = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return availableTasks;
        return availableTasks.filter(t => t.title.toLowerCase().includes(q));
    }, [availableTasks, query]);

    // ---------- Gestion des dépendances ----------
    const toggleDependency = async (taskId: string) => {
        if (dependencyIds.has(taskId)) {
            if (isEdit) {
                const dep = existingDependencies.find(d => d.predecessor_task_id === taskId);
                if (dep) await removeTaskDependency(dep.id);
                setExistingDependencies(prev => prev.filter(d => d.predecessor_task_id !== taskId));
            }
            setDependencyIds(prev => {
                const copy = new Set(prev);
                copy.delete(taskId);
                return copy;
            });
        } else {
            if (isEdit) {
                const { data: newDep } = await addTaskDependency(taskId, task!.id);
                if (newDep) setExistingDependencies(prev => [...prev, newDep]);
            }
            setDependencyIds(prev => new Set(prev).add(taskId));
        }
    };

    // ---------- Soumission ----------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title,
                description,
                dueDate: dueDate || null,
                start_date: startDate || null,
                is_daily: isDaily,
                project_id: projectId || null
            };

            let taskId = task?.id;

            if (isEdit) {
                await updateTask(taskId!, payload);
            } else {
                const user = await getActualUser();
                const { data: newTask } = await createTask({ ...payload, user_id: user?.id });
                taskId = newTask.id;

                // Ajouter dépendances
                await Promise.all(Array.from(dependencyIds).map(depId =>
                    supabase.from('task_dependencies').insert({
                        predecessor_task_id: depId,
                        successor_task_id: taskId
                    })
                ));
            }

            navigate(isEdit ? `/task/${taskId}` : "/task/list");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* --- Partie principale --- */}
            <div className="md:col-span-2 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? `Modifier la tâche` : "Créer une tâche"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Titre */}
                        <div>
                            <Label htmlFor="title">Titre</Label>
                            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <div className="border rounded"><MDEditor value={description} onChange={setDescription} height={250} /></div>
                        </div>

                        {/* Projet / Date / Quotidienne */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="projectId">Projet</Label>
                                <select id="projectId" className="w-full rounded border px-3 py-2" value={projectId} onChange={e => setProjectId(e.target.value)}>
                                    <option value="">Aucun</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="dueDate">Date d'échéance</Label>
                                <Input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                            </div>

                            <div className="flex items-end">
                                <Button type="button" variant={isDaily ? "default" : "outline"} onClick={() => setIsDaily(!isDaily)} className="flex items-center gap-2">
                                    {isDaily ? <CheckCircle /> : <Circle />} <span>Quotidienne</span>
                                </Button>
                            </div>
                        </div>

                        {/* Date de début */}
                        {isDaily && (
                            <div>
                                <Label htmlFor="startDate">Date de début</Label>
                                <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                            </div>
                        )}

                        {/* Bouton */}
                        <Button type="submit" disabled={loading}>{loading ? "Chargement..." : isEdit ? "Enregistrer" : "Créer la tâche"}</Button>
                    </CardContent>
                </Card>
            </div>

            {/* --- Sidebar Dépendances --- */}
            <aside className="space-y-4">
                <Card>
                    <CardHeader><CardTitle>Dépendances</CardTitle></CardHeader>
                    <CardContent>
                        <div className="mb-3 flex items-center gap-2">
                            <Search size={16} />
                            <Input
                                placeholder={projectId ? "Rechercher une tâche..." : "Choisissez d'abord un projet"}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                disabled={!projectId}
                            />
                        </div>

                        <div className="max-h-72 overflow-auto">
                            {!projectId ? (
                                <p className="text-sm text-muted-foreground">Sélectionnez un projet pour afficher les tâches disponibles comme dépendances.</p>
                            ) : filteredTasks.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Aucune tâche trouvée pour ce projet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {filteredTasks.map(t => (
                                        <li key={t.id} className="flex items-start gap-3">
                                            <Checkbox id={`dep-${t.id}`} checked={dependencyIds.has(t.id)} onCheckedChange={() => toggleDependency(t.id)} />
                                            <label htmlFor={`dep-${t.id}`} className="cursor-pointer flex-1">
                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm font-medium">{t.title}</div>
                                                    <div className="text-xs text-gray-500">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ""}</div>
                                                </div>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                            <p>Les dépendances ne peuvent être choisies que si vous avez sélectionné un projet.</p>
                        </div>
                    </CardContent>
                </Card>
            </aside>
        </form>
    );
}
