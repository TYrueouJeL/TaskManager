export interface Project {
    id: string;
    title: string;
    user_id: string;
    description?: string | null;
    created_at?: string | null;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate?: string | null;
    user_id: string;
    is_daily?: boolean | null;
    validationDate?: string | null;
    project_id?: string | null;
    project_name?: string | null;
    created_at?: string | null;
}

export interface User {
    id: string;
    email: string;
    username?: string | null;
    created_at?: string | null;
}