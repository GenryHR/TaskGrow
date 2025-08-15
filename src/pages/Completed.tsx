import { useEffect, useMemo } from "react";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useTasks } from "@/hooks/useTasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format, isToday, startOfDay } from "date-fns";

const Completed = () => {
  const { t } = useI18n();
  const { completedTasks, toggleComplete, removeTask } = useTasks();

  useEffect(() => {
    try {
      document.title = `${t("appName")} — ${t("completed")}`;
    } catch (error) {
      console.error("Error setting document title:", error);
    }
  }, [t]);

  const groupedTasks = useMemo(() => {
    try {
      const groups: { [key: string]: typeof completedTasks } = {};
      
      completedTasks.forEach(task => {
        if (task.completedAt) {
          const completedDate = new Date(task.completedAt);
          if (isToday(completedDate)) {
            if (!groups["today"]) groups["today"] = [];
            groups["today"].push(task);
          } else {
            const dateKey = format(completedDate, "dd.MM.yyyy");
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(task);
          }
        }
      });

      // Sort by date (newest first)
      const sortedGroups = Object.entries(groups).sort(([a], [b]) => {
        if (a === "today") return -1;
        if (b === "today") return 1;
        return new Date(b.split('.').reverse().join('-')).getTime() - new Date(a.split('.').reverse().join('-')).getTime();
      });

      return sortedGroups;
    } catch (error) {
      console.error("Error grouping completed tasks:", error);
      return [];
    }
  }, [completedTasks]);

  const handleToggleComplete = (id: string) => {
    try {
      toggleComplete(id);
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const handleDelete = (id: string) => {
    try {
      removeTask(id);
    } catch (error) {
      console.error("Error removing task:", error);
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
          <h2 className="text-lg font-semibold mb-4">{t("completed")}</h2>
          {completedTasks.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-4xl mb-4">✅</div>
              <p className="text-sm text-muted-foreground">{t("empty")}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedTasks.map(([dateKey, tasks]) => (
                <div key={dateKey} className="animate-fade-in">
                   <h3 className="text-md font-medium mb-3 text-muted-foreground">
                     {dateKey === "today" ? t("today") : dateKey}
                   </h3>
                  <ul className="space-y-2">
                    {tasks.map((task) => (
                      <li key={task.id} className="group flex items-start gap-3 rounded-lg bg-secondary/30 px-3 py-2 transition-all duration-200 hover:bg-secondary/50 animate-slide-up">
                        <div className="flex-shrink-0">
                          <Checkbox checked={task.completed} onCheckedChange={() => handleToggleComplete(task.id)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm line-through text-muted-foreground">{task.title}</div>
                          {task.description && <div className="text-xs text-muted-foreground">{task.description}</div>}
                          {task.completedAt && (
                             <div className="text-xs text-muted-foreground">
                               {t("completedAt")}: {format(new Date(task.completedAt), "HH:mm")}
                             </div>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" onClick={() => handleDelete(task.id)} aria-label={t("delete")}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Completed;
