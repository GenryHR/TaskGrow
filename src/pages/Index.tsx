import { useEffect, useMemo, useState } from "react";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Onboarding } from "@/components/Onboarding";
import { TaskModal, LABELS } from "@/components/tasks/TaskModal";
import { useTasks, type Category, type Task } from "@/hooks/useTasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

const order: Category[] = ["today", "tomorrow", "week", "someday"];

const Index = () => {
  useEffect(() => {
    try {
      document.title = "GrowTasks — Главный экран";
    } catch (error) {
      console.error("Error setting document title:", error);
    }
  }, []);

  const { addTask, byCategory, counts, toggleComplete, removeTask, updateTask, dailyStats } = useTasks();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("today");
  const [editing, setEditing] = useState<Task | null>(null);

  const openCreate = (cat: Category) => {
    try {
      setActiveCategory(cat);
      setModalOpen(true);
      setEditing(null);
    } catch (error) {
      console.error("Error opening create modal:", error);
    }
  };

  const handleToggleComplete = (id: string) => {
    try {
      toggleComplete(id);
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast("Ошибка при изменении статуса задачи");
    }
  };

  const handleDelete = (id: string) => {
    try {
      removeTask(id);
      toast("Удалено");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast("Ошибка при удалении задачи");
    }
  };

  const handleEdit = (task: Task) => {
    try {
      setEditing(task);
      setActiveCategory(task.category);
      setModalOpen(true);
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleStatsClick = () => {
    try {
      navigate("/completed");
    } catch (error) {
      console.error("Error navigating to completed:", error);
    }
  };

  return (
    <div className="min-h-screen relative app-gradient-bg">
      {/* Ambient fog */}
      <div className="fog" />

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/40 border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="app-title text-xl md:text-2xl tracking-tight">GrowTasks</h1>
          
        </div>
      </header>

      {/* Content layout */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar (kept simple) */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-3">
          <SidebarNav />
        </aside>

        {/* Main scrollable list */}
        <main className="col-span-12 md:col-span-9 lg:col-span-9 min-h-[60vh]">
          <div className="space-y-8">
            {order.map((cat) => (
              <CategoryBlock
                key={cat}
                category={cat}
                tasks={byCategory(cat)}
                count={counts[cat] as number}
                dailyStats={cat === "today" ? dailyStats : undefined}
                onToggle={handleToggleComplete}
                onDelete={handleDelete}
                onClickHeader={() => openCreate(cat)}
                onEdit={handleEdit}
                onStatsClick={handleStatsClick}
              />
            ))}
          </div>
        </main>
      </div>

      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        category={activeCategory}
        onCreate={(payload) => {
          try {
            addTask(payload);
          } catch (error) {
            console.error("Error creating task:", error);
            toast("Ошибка при создании задачи");
          }
        }}
        editing={editing ? { id: editing.id, title: editing.title, category: editing.category, description: editing.description, priority: editing.priority, dueDate: editing.dueDate } : null}
        onUpdate={(id, payload) => {
          try {
            updateTask(id, payload);
          } catch (error) {
            console.error("Error updating task:", error);
            toast("Ошибка при обновлении задачи");
          }
        }}
      />

      <Onboarding />
    </div>
  );
};

function CategoryBlock({
  category,
  tasks,
  count,
  dailyStats,
  onToggle,
  onDelete,
  onClickHeader,
  onEdit,
  onStatsClick,
}: {
  category: Category;
  tasks: Task[];
  count: number;
  dailyStats?: { completed: number; total: number };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClickHeader: () => void;
  onEdit: (task: Task) => void;
  onStatsClick?: () => void;
}) {
  const hasTasks = tasks.length > 0;
  const sorted = useMemo(() => tasks.slice().sort((a, b) => Number(a.completed) - Number(b.completed)), [tasks]);

  const getPriorityClass = (priority: Task["priority"]) => {
    switch (priority) {
      case "low": return "task-priority-low";
      case "high": return "task-priority-high";
      default: return "";
    }
  };

  return (
    <section className="relative">
      <header
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={onClickHeader}
      >
        <h2 className="text-lg font-semibold">
          {LABELS[category]} <span className="text-muted-foreground font-normal">({count})</span>
        </h2>
        {dailyStats && (
          <div 
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-secondary/50 px-3 py-1 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onStatsClick?.();
            }}
          >
            {dailyStats.completed}/{dailyStats.total}
          </div>
        )}
      </header>

      <div className="mt-3 space-y-2">
        {!hasTasks ? (
          <div className="relative overflow-hidden rounded-lg p-8 bg-secondary/30 hover-scale animate-fade-in cursor-pointer" onClick={onClickHeader} role="button" tabIndex={0}>
            <div className="absolute inset-0 opacity-60">
              <div className="fog" />
            </div>
            <p className="relative text-center text-sm text-muted-foreground">Здесь пока пусто</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {sorted.map((t) => (
              <li key={t.id} className={`task-item group flex items-center gap-3 rounded-lg bg-secondary/30 px-3 py-2 cursor-pointer animate-slide-up transition-all duration-200 hover:bg-secondary/50 ${getPriorityClass(t.priority)}`} onClick={() => onEdit(t)}>
                <div className="flex-shrink-0">
                  <Checkbox
                    checked={t.completed}
                    onCheckedChange={() => onToggle(t.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Отметить выполненной"
                    className="task-checkbox"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`block text-sm ${t.completed ? "line-through text-muted-foreground" : ""}`}>
                    {t.title}
                  </span>
                  {t.description ? (
                    <span className="block text-xs text-muted-foreground">{t.description}</span>
                  ) : null}
                </div>
                {category === "someday" && t.dueDate ? (
                  <span className="text-xs text-muted-foreground mr-1 flex-shrink-0">
                    {format(parseISO(t.dueDate), "dd.MM.yyyy")}
                  </span>
                ) : null}
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" onClick={(e) => { e.stopPropagation(); onDelete(t.id); }} aria-label="Удалить">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Index;
