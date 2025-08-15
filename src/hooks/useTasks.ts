import { useCallback, useEffect, useMemo, useState } from "react";
import { differenceInCalendarDays, parseISO, startOfDay, format, isToday } from "date-fns";

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
  completedAt?: number; // Timestamp when task was completed
  deleted: boolean;
  deletedAt?: number; // Timestamp when task was deleted
  createdAt: number;
};

const STORAGE_KEY = "tasks_v2";

// Safe localStorage functions
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const raw = safeGetItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Task[];
    } catch (error) {
      console.error("Error parsing tasks from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    safeSetItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const getEffectiveCategory = useCallback((t: Task): Category => {
    try {
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
    } catch (error) {
      console.error("Error calculating effective category:", error);
      return t.category;
    }
  }, []);

  const addTask = useCallback(
    (payload: { title: string; category: Category; description?: string; priority?: Priority; dueDate?: string }) => {
      try {
        setTasks((prev) => [
          {
            id: crypto.randomUUID(),
            title: payload.title,
            description: payload.description?.trim() || undefined,
            priority: payload.priority || "medium",
            category: payload.category,
            dueDate: payload.dueDate,
            completed: false,
            deleted: false,
            createdAt: Date.now(),
          },
          ...prev,
        ]);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    []
  );

  const toggleComplete = useCallback((id: string) => {
    try {
      setTasks((prev) => prev.map((t) => (t.id === id ? { 
        ...t, 
        completed: !t.completed, 
        completedAt: !t.completed ? Date.now() : undefined 
      } : t)));
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  }, []);

  const removeTask = useCallback((id: string) => {
    try {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, deleted: true, deletedAt: Date.now() } : t)));
    } catch (error) {
      console.error("Error removing task:", error);
    }
  }, []);

  const restoreTask = useCallback((id: string) => {
    try {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, deleted: false, deletedAt: undefined } : t)));
    } catch (error) {
      console.error("Error restoring task:", error);
    }
  }, []);

  const permanentlyDeleteTask = useCallback((id: string) => {
    try {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error permanently deleting task:", error);
    }
  }, []);

  const clearTrash = useCallback(() => {
    try {
      setTasks((prev) => prev.filter((t) => !t.deleted));
    } catch (error) {
      console.error("Error clearing trash:", error);
    }
  }, []);

  const updateTask = useCallback(
    (
      id: string,
      updates: Partial<Pick<Task, "title" | "category" | "completed" | "description" | "priority" | "dueDate">>
    ) => {
      try {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
    []
  );

  const activeTasks = useMemo(() => tasks.filter((t) => !t.deleted && !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => !t.deleted && t.completed), [tasks]);
  const deletedTasks = useMemo(() => tasks.filter((t) => t.deleted), [tasks]);

  const byCategory = useCallback(
    (category: Category) => activeTasks.filter((t) => getEffectiveCategory(t) === category),
    [activeTasks, getEffectiveCategory]
  );

  // Daily statistics
  const dailyStats = useMemo(() => {
    try {
      const today = startOfDay(new Date());
      const todayCompleted = tasks.filter(t => 
        !t.deleted && 
        t.completed && 
        t.completedAt && 
        isToday(new Date(t.completedAt))
      );
      
      // Total includes all tasks in "today" category (completed + incomplete)
      const todayTotalTasks = byCategory("today").length + todayCompleted.length;
      
      return {
        completed: todayCompleted.length,
        total: todayTotalTasks
      };
    } catch (error) {
      console.error("Error calculating daily stats:", error);
      return { completed: 0, total: 0 };
    }
  }, [tasks, byCategory]);

  const counts = useMemo(
    () => ({
      today: byCategory("today").length,
      tomorrow: byCategory("tomorrow").length,
      week: byCategory("week").length,
      someday: byCategory("someday").length,
    }),
    [byCategory]
  );

  return { 
    tasks: activeTasks, 
    completedTasks,
    deletedTasks,
    addTask, 
    toggleComplete, 
    updateTask, 
    removeTask, 
    restoreTask,
    permanentlyDeleteTask,
    clearTrash,
    byCategory, 
    counts,
    dailyStats
  };
}
