import { useEffect, useMemo } from "react";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useTasks } from "@/hooks/useTasks";

const Garden = () => {
  const { t } = useI18n();
  const { completedTasks } = useTasks();
  const completed = completedTasks.length;
  
  const getPlantStage = (index: number) => {
    if (index < 3) return "seed";
    if (index < 8) return "sprout";
    if (index < 15) return "flower";
    return "tree";
  };

  const getPlantClass = (stage: string) => {
    switch (stage) {
      case "seed": return "plant-seed";
      case "sprout": return "plant-sprout";
      case "flower": return "plant-flower";
      case "tree": return "plant-tree";
      default: return "plant-seed";
    }
  };

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
          <div className="rounded-xl bg-secondary/30 p-6 hover-glow">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2 animate-slide-up">🌱 Ваш цифровой сад</h3>
              <p className="text-sm text-muted-foreground animate-slide-up">
                Каждая выполненная задача помогает вашему саду расти. От семечка до могучего дерева!
              </p>
            </div>
            
            {completed === 0 ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="text-6xl mb-4">🌱</div>
                <p className="text-muted-foreground">Выполните первую задачу, чтобы посадить семечко!</p>
              </div>
            ) : (
              <div className="garden-grid mx-auto">
                {Array.from({ length: completed }).map((_, i) => {
                  const stage = getPlantStage(i);
                  const plantClass = getPlantClass(stage);
                  return (
                    <div 
                      key={i} 
                      className="flex items-end justify-center h-20 animate-grow-plant hover-scale"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className={`${plantClass} animate-pulse-glow`} />
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-6 text-center space-y-2 animate-slide-up">
              <p className="text-sm font-medium">Завершено задач: {completed}</p>
              <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                <span>🌱 Семечки: 0-2</span>
                <span>🌿 Ростки: 3-7</span>
                <span>🌸 Цветы: 8-14</span>
                <span>🌳 Деревья: 15+</span>
              </div>
              {completed >= 15 && (
                <p className="text-sm font-semibold text-primary animate-bounce-in">
                  🎉 Поздравляем! Ваш сад превратился в лес!
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Garden;
