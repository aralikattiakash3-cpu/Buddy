
export const FARM_TASK_STORAGE_KEY = 'krishimitra-farm-planner-v1';

export type LocalFarmTask = {
    id: string;
    title: string;
    category: string;
    dueDate: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'pending' | 'completed';
};

export function getLocalFarmTasks(): LocalFarmTask[] {
    try {
        const stored = localStorage.getItem(FARM_TASK_STORAGE_KEY);
        if (!stored) return [];

        const parsed: unknown = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter((task): task is LocalFarmTask => {
            if (!task || typeof task !== 'object') return false;

            const value = task as Record<string, unknown>;

            return (
                typeof value.id === 'string' &&
                typeof value.title === 'string' &&
                typeof value.category === 'string' &&
                typeof value.dueDate === 'string' &&
                ['Low', 'Medium', 'High'].includes(String(value.priority)) &&
                ['pending', 'completed'].includes(String(value.status))
            );
        });
    } catch {
        return [];
    }
}

export function saveLocalFarmTasks(tasks: LocalFarmTask[]): void {
    localStorage.setItem(FARM_TASK_STORAGE_KEY, JSON.stringify(tasks));
    window.dispatchEvent(new Event('krishimitra-tasks-updated'));
}
