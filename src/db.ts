export interface Project {
    id: string;
    title: string;
    description?: string | null;
    created_at?: string | null;
    validationDate?: string | null;
}

export interface Task {
    id: string;
    title: string;
    description?: string | null;
    dueDate?: string | null;
    validationDate?: string | null;
    project_id?: string | null;
    created_at?: string | null;
}