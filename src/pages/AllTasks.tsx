import { useEffect } from "react";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { useI18n } from "@/components/i18n/I18nProvider";

const AllTasks = () => {
  const { t } = useI18n();
  useEffect(() => {
    document.title = `${t("appName")} — ${t("allTasks")}`;
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
          <h2 className="text-lg font-semibold mb-4">{t("allTasks")}</h2>
          <p className="text-sm text-muted-foreground">Soon: full list view</p>
        </main>
      </div>
    </div>
  );
};

export default AllTasks;
