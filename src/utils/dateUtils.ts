export function formatDate(iso?: string | null): string {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

export function getTomorrow(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}

export interface TaskStatus {
    isDone: boolean;
    isToday: boolean;
    isOverdue: boolean;
}

export function calculateTaskStatus(
    task: { validationDate?: string | null; dueDate?: string | null }
): TaskStatus {
    const isDone = Boolean(task.validationDate);
    
    if (!task.dueDate) {
        return { isDone, isToday: false, isOverdue: false };
    }
    
    const due = new Date(task.dueDate);
    const now = new Date();
    
    const isToday = !isDone && due.toDateString() === now.toDateString();
    const isOverdue = !isDone && due < now;
    
    return { isDone, isToday, isOverdue };
}
