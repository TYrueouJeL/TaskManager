import { supabase } from '../supabase/supabaseClient';
import type {Project, Task, User} from "../db.ts";

export async function getProjects(): Promise<{ data?: Project[]; error?: any }> {
    return supabase.from<Project>('project').select('*');
}

export async function getProject(id: string) {
    return supabase.from<Project>('project').select('*').eq('id', id).single();
}

export async function getProjectByTask(taskId: string) {
    return supabase
        .from<Project>('project')
        .select('*, task!inner(id)')
        .eq('task.id', taskId)
        .single();
}

export async function createProject(payload: Partial<Project>) {
    return supabase.from<Project>('project').insert(payload).single();
}

export async function updateProject(id: string, payload: Partial<Project>) {
    return supabase.from<Project>('project').update(payload).eq('id', id).single();
}

export async function deleteProject(id: string) {
    return supabase.from<Project>('project').delete().eq('id', id).single();
}

export async function getTasksByProject(projectId: string) {
    return supabase.from<Task>('task').select('*').eq('project_id', projectId).order('dueDate', { ascending: true });
}

export async function getTasks() {
    return supabase.from<Task>('task').select('*').order('dueDate', { ascending: true });
}

export async function getTask(id: string) {
    return supabase.from<Task>('task').select('*').eq('id', id).single();
}

export async function createTask(payload: Partial<Task>) {
    return supabase.from<Task>('task').insert(payload).single();
}

export async function updateTask(id: string, payload: Partial<Task>) {
    return supabase.from<Task>('task').update(payload).eq('id', id).single();
}

export async function validateTask(id: string) {
    return supabase.from<Task>('task').update({ validationDate: new Date().toISOString() }).eq('id', id).single();
}

export async function deleteTask(id: string) {
    return supabase.from<Task>('task').delete().eq('id', id).single();
}

export async function getActualUser() {
    const user = supabase.auth.getUser();
    return (await user).data.user as User;
}

export async function getUser(id: string) {
    return supabase.from<User>('user').select('*').eq('id', id).single();
}