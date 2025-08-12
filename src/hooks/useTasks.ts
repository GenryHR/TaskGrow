import { useCallback, useEffect, useMemo, useState } from "react";
import { differenceInCalendarDays, parseISO, startOfDay } from "date-fns";

export type Category = "today" | "tomorrow" | "week" | "someday";
export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
  dueDate?: string; // ISO date string: YYYY-MM-DD
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

  const getEffectiveCategory = useCallback((t: Task): Category => {
    // Tasks in "today" never leave automatically
    if (t.category === "today") return "today";

    if (t.dueDate && !t.completed) {
      const today = startOfDay(new Date());
      const diff = differenceInCalendarDays(parseISO(t.dueDate), today);
      if (diff <= 0) return "today";
      if (diff === 1) return "tomorrow";
      if (diff <= 7) return "week";
      return "someday";
    }

    return t.category;
  }, []);

  const addTask = useCallback(
    (payload: { title: string; category: Category; description?: string; priority?: Priority; dueDate?: string }) => {
      setTasks((prev) => [
        {
          id: crypto.randomUUID(),
          title: payload.title,
          description: payload.description?.trim() || undefined,
          priority: payload.priority || "medium",
          category: payload.category,
          dueDate: payload.dueDate,
          completed: false,
          createdAt: Date.now(),
        },
        ...prev,
      ]);
    },
    []
  );

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTask = useCallback(
    (
      id: string,
      updates: Partial<Pick<Task, "title" | "category" | "completed" | "description" | "priority" | "dueDate">>
    ) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    },
    []
  );

  const byCategory = useCallback(
    (category: Category) => tasks.filter((t) => getEffectiveCategory(t) === category),
    [tasks, getEffectiveCategory]
  );

  const counts = useMemo(
    () => ({
      today: byCategory("today").length,
      tomorrow: byCategory("tomorrow").length,
      week: byCategory("week").length,
      someday: byCategory("someday").length,
    }),
    [byCategory]
  );

  return { tasks, addTask, toggleComplete, updateTask, removeTask, byCategory, counts };
}
