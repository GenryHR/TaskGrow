import { useEffect, useMemo } from "react";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useTasks } from "@/hooks/useTasks";

const Garden = () => {
  const { t } = useI18n();
  const { tasks } = useTasks();
  const completed = useMemo(() => tasks.filter((x) => x.completed).length, [tasks]);

  useEffect(() => {
    document.title = `${t("appName")} — ${t("garden")}`;
  }, [t]);
  return (
    <div className="min-h-screen relative app-gradient-bg">
      <div className="fog" />
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/40 border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{t("appName")}</h1>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3 lg:col-span-3">
          <SidebarNav />
        </aside>
        <main className="col-span-12 md:col-span-9 lg:col-span-9 min-h-[60vh]">
          <h2 className="text-lg font-semibold mb-4">{t("garden")}</h2>
          <div className="rounded-xl bg-secondary/30 p-6">
            <p className="text-sm text-muted-foreground mb-2">Мини-сад растёт от завершённых задач.</p>
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: completed || 1 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-full bg-primary/20 shadow-sm animate-fade-in" />
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Завершено: {completed}</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Garden;
