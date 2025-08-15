import { useEffect, useMemo } from "react";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useTasks } from "@/hooks/useTasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const AllTasks = () => {
  const { t } = useI18n();
  const { tasks, toggleComplete, removeTask } = useTasks();

  useEffect(() => {
    document.title = `${t("appName")} — ${t("allTasks")}`;
  }, [t]);

  const sorted = useMemo(() => tasks.slice().sort((a, b) => b.createdAt - a.createdAt), [tasks]);

  const getPriorityClass = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "low": return "task-priority-low";
      case "high": return "task-priority-high";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen relative app-gradient-bg">
      <div className="fog" />
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/40 border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="app-title text-xl md:text-2xl tracking-tight">{t("appName")}</h1>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3 lg:col-span-3">
          <SidebarNav />
        </aside>
        <main className="col-span-12 md:col-span-9 lg:col-span-9 min-h-[60vh]">
          <h2 className="text-lg font-semibold mb-4">{t("allTasks")}</h2>
          {sorted.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-sm text-muted-foreground">{t("empty")}</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {sorted.map((task) => (
                <li key={task.id} className={`group flex items-start gap-3 rounded-lg bg-secondary/30 px-3 py-2 hover-scale animate-slide-up ${getPriorityClass(task.priority)}`}>
                  <Checkbox checked={task.completed} onCheckedChange={() => toggleComplete(task.id)} />
                  <div className="flex-1">
                    <div className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.title}</div>
                    {task.description && <div className="text-xs text-muted-foreground">{task.description}</div>}
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity hover-scale" onClick={() => removeTask(task.id)} aria-label={t("delete")}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllTasks;
