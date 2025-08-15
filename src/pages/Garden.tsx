import { useEffect, useMemo } from "react";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useTasks } from "@/hooks/useTasks";

const Garden = () => {
  const { t } = useI18n();
  const { completedTasks } = useTasks();
  const completed = completedTasks.length;
  
  const getPlantStage = (index: number) => {
    try {
      if (index < 3) return "seed";
      if (index < 8) return "sprout";
      if (index < 15) return "flower";
      return "tree";
    } catch (error) {
      console.error("Error getting plant stage:", error);
      return "seed";
    }
  };

  const getPlantClass = (stage: string) => {
    try {
      switch (stage) {
        case "seed": return "plant-seed";
        case "sprout": return "plant-sprout";
        case "flower": return "plant-flower";
        case "tree": return "plant-tree";
        default: return "plant-seed";
      }
    } catch (error) {
      console.error("Error getting plant class:", error);
      return "plant-seed";
    }
  };

  useEffect(() => {
    try {
      document.title = `${t("appName")} — ${t("garden")}`;
    } catch (error) {
      console.error("Error setting document title:", error);
    }
  }, [t]);

  const plantElements = useMemo(() => {
    try {
      return Array.from({ length: Math.min(completed, 20) }).map((_, i) => {
        const stage = getPlantStage(i);
        const plantClass = getPlantClass(stage);
        return (
          <div 
            key={i} 
            className="garden-spot animate-grow-plant hover-scale"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`${plantClass} animate-pulse-glow`} />
          </div>
        );
      });
    } catch (error) {
      console.error("Error creating plant elements:", error);
      return [];
    }
  }, [completed]);

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
          <h2 className="text-lg font-semibold mb-4">{t("garden")}</h2>
          <div className="garden-container rounded-xl overflow-hidden">
            <div className="garden-sky"></div>
            <div className="garden-ground">
              <div className="text-center mb-6 relative z-10">
                <h3 className="text-xl font-semibold mb-2 animate-slide-up text-white drop-shadow-lg">🌱 {t("gardenTitle")}</h3>
                <p className="text-sm text-white/90 animate-slide-up drop-shadow">
                  {t("gardenDescription")}
                </p>
              </div>
              
              {completed === 0 ? (
                <div className="text-center py-12 animate-fade-in relative z-10">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="text-white/80 drop-shadow">{t("gardenEmpty")}</p>
                </div>
              ) : (
                <div className="garden-plot relative z-10">
                  {plantElements}
                  {completed > 20 && (
                    <div className="col-span-full text-center mt-4">
                      <p className="text-white/80 text-sm">+ {completed - 20} {t("morePlants")}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-6 text-center space-y-2 animate-slide-up relative z-10">
                <p className="text-sm font-medium text-white drop-shadow">{t("gardenProgress")}: {completed}</p>
                <div className="flex justify-center gap-4 text-xs text-white/80">
                  <span>🌱 {t("priorityLow")}: 0-2</span>
                  <span>🌿 {t("priorityMedium")}: 3-7</span>
                  <span>🌸 {t("priorityHigh")}: 8-14</span>
                  <span>🌳 {t("completedAt")}: 15+</span>
                </div>
                {completed >= 15 && (
                  <p className="text-sm font-semibold text-yellow-300 animate-bounce-in drop-shadow">
                    🎉 {t("gardenCongrats")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Garden;
