import { useCallback, useEffect, useMemo, useState } from "react";

export type Category = "today" | "tomorrow" | "week" | "someday";

export type Task = {
  id: string;
  title: string;
  category: Category;
  completed: boolean;
  createdAt: number;
};

const STORAGE_KEY = "tasks_v1";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((title: string, category: Category) => {
    setTasks((prev) => [
      { id: crypto.randomUUID(), title, category, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Pick<Task, "title" | "category" | "completed">>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const byCategory = useCallback(
    (category: Category) => tasks.filter((t) => t.category === category),
    [tasks]
  );

  const counts = useMemo(() => ({
    today: byCategory("today").length,
    tomorrow: byCategory("tomorrow").length,
    week: byCategory("week").length,
    someday: byCategory("someday").length,
  }), [byCategory]);

  return { tasks, addTask, toggleComplete, updateTask, removeTask, byCategory, counts };
}
