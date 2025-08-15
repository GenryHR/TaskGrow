import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Trash2, Undo2 } from "lucide-react";
import { TaskModal, EditingPayload } from "@/components/tasks/TaskModal";
import { format } from "date-fns";

const Trash = () => {
  const { t } = useI18n();
  const { deletedTasks, restoreTask, permanentlyDeleteTask, clearTrash } = useTasks();
  const [editing, setEditing] = useState<EditingPayload | null>(null);

  useEffect(() => {
    document.title = `${t("appName")} — Корзина`;
  }, [t]);

  const handleRestore = (task: any) => {
    restoreTask(task.id);
  };

  const handlePermanentDelete = (task: any) => {
    permanentlyDeleteTask(task.id);
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t("trash")}</h2>
            {deletedTasks.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={clearTrash}
                className="animate-fade-in hover-scale"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("clearTrash")}
              </Button>
            )}
          </div>
          {deletedTasks.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <Trash2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">{t("trashEmpty")}</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {deletedTasks.map((task) => (
                <li 
                  key={task.id} 
                  className="group flex items-start gap-3 rounded-lg bg-secondary/30 px-3 py-2 hover-scale cursor-pointer animate-fade-in"
                  onClick={() => setEditing({
                    id: task.id,
                    title: task.title,
                    category: task.category,
                    description: task.description,
                    priority: task.priority,
                    dueDate: task.dueDate,
                  })}
                >
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground line-through">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-muted-foreground">{task.description}</div>
                    )}
                    {task.deletedAt && (
                      <div className="text-xs text-muted-foreground">
                        {t("deletedAt")}: {format(new Date(task.deletedAt), "dd.MM.yyyy HH:mm")}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(task);
                      }}
                      aria-label={t("restore")}
                      className="hover-scale"
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePermanentDelete(task);
                      }}
                      aria-label={t("delete")}
                      className="text-destructive hover:text-destructive hover-scale"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>

      {editing && (
        <TaskModal
          open={true}
          onOpenChange={(open) => !open && setEditing(null)}
          category="today"
          editing={editing}
          onUpdate={(id, payload) => {
            // This is for trash - we handle restore/delete differently
            setEditing(null);
          }}
          isTrashMode={true}
          onRestore={() => {
            if (editing) {
              restoreTask(editing.id);
              setEditing(null);
            }
          }}
          onPermanentDelete={() => {
            if (editing) {
              permanentlyDeleteTask(editing.id);
              setEditing(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default Trash;