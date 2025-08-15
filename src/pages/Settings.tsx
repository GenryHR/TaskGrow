import { useEffect } from "react";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  const { t, lang, setLang } = useI18n();
  
  useEffect(() => {
    try {
      document.title = `${t("appName")} — ${t("settings")}`;
    } catch (error) {
      console.error("Error setting document title:", error);
    }
  }, [t]);

  const handleLanguageChange = (value: string) => {
    try {
      setLang(value as any);
    } catch (error) {
      console.error("Error changing language:", error);
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
        <main className="col-span-12 md:col-span-9 lg:col-span-9 min-h-[60vh] space-y-6">
          <h2 className="text-lg font-semibold">{t("settings")}</h2>

          <section className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t("theme")}</h3>
            <div className="w-56"><ThemeSelector /></div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t("language")}</h3>
            <div className="w-56">
              <Select value={lang} onValueChange={handleLanguageChange}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Settings;
