import { useEffect, useMemo, useState } from "react";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import { Onboarding } from "@/components/Onboarding";
import { TaskModal, LABELS } from "@/components/tasks/TaskModal";
import { useTasks, type Category, type Task } from "@/hooks/useTasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const order: Category[] = ["today", "tomorrow", "week", "someday"];

const Index = () => {
  useEffect(() => {
    document.title = "SEGMBA Tasks — Главный экран";
  }, []);

  const { addTask, byCategory, counts, toggleComplete, removeTask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("today");

  const openCreate = (cat: Category) => {
    setActiveCategory(cat);
    setModalOpen(true);
  };

  const createTask = (title: string) => {
    addTask(title, activeCategory);
    toast("Задача добавлена");
  };

  return (
    <div className="min-h-screen relative app-gradient-bg">
      {/* Ambient fog */}
      <div className="fog" />

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/40 border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Главный экран</h1>
          <ThemeSelector />
        </div>
      </header>

      {/* Content layout */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar (kept simple) */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-3">
          <nav className="space-y-2">
            <a className="block px-3 py-2 rounded-md bg-secondary/50 hover-scale" href="#" aria-current>
              Главный экран
            </a>
          </nav>
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
                onToggle={toggleComplete}
                onDelete={(id) => {
                  removeTask(id);
                  toast("Удалено");
                }}
                onClickHeader={() => openCreate(cat)}
              />
            ))}
          </div>
        </main>
      </div>

      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        category={activeCategory}
        onCreate={createTask}
      />

      <Onboarding />
    </div>
  );
};

function CategoryBlock({
  category,
  tasks,
  count,
  onToggle,
  onDelete,
  onClickHeader,
}: {
  category: Category;
  tasks: Task[];
  count: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClickHeader: () => void;
}) {
  const hasTasks = tasks.length > 0;
  const sorted = useMemo(() => tasks.slice().sort((a, b) => Number(a.completed) - Number(b.completed)), [tasks]);

  return (
    <section className="relative">
      <header
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={onClickHeader}
      >
        <h2 className="text-lg font-semibold">
          {LABELS[category]} <span className="text-muted-foreground font-normal">({count})</span>
        </h2>
        <Button variant="ghost" className="hover-scale" onClick={(e) => { e.stopPropagation(); onClickHeader(); }}>
          Добавить
        </Button>
      </header>

      <div className="mt-3 space-y-2">
        {!hasTasks ? (
          <div className="relative overflow-hidden rounded-lg p-8 bg-secondary/30">
            <div className="absolute inset-0 opacity-60">
              <div className="fog" />
            </div>
            <p className="relative text-center text-sm text-muted-foreground">Здесь пока пусто</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {sorted.map((t) => (
              <li key={t.id} className="group flex items-center gap-3 rounded-lg bg-secondary/30 px-3 py-2">
                <Checkbox
                  checked={t.completed}
                  onCheckedChange={() => onToggle(t.id)}
                  aria-label="Отметить выполненной"
                />
                <span className={`flex-1 text-sm ${t.completed ? "line-through text-muted-foreground" : ""}`}>
                  {t.title}
                </span>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDelete(t.id)} aria-label="Удалить">
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
