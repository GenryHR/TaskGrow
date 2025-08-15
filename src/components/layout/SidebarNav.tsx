import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useMemo } from "react";

export const SidebarNav = () => {
  const { t } = useI18n();
  
  const items = useMemo(() => {
    try {
      return [
        { to: "/", label: t("mainScreen") },
        { to: "/all", label: t("allTasks") },
        { to: "/completed", label: t("completed") },
        { to: "/garden", label: t("garden") },
        { to: "/trash", label: t("trash") },
        { to: "/settings", label: t("settings") },
      ];
    } catch (error) {
      console.error("Error creating navigation items:", error);
      return [
        { to: "/", label: "Главный экран" },
        { to: "/all", label: "Все задачи" },
        { to: "/completed", label: "Завершенные" },
        { to: "/garden", label: "Сад" },
        { to: "/trash", label: "Корзина" },
        { to: "/settings", label: "Настройки" },
      ];
    }
  }, [t]);

  return (
    <nav className="space-y-2">
      {items.map((i) => (
        <NavLink
          key={i.to}
          to={i.to}
          className={({ isActive }) =>
            cn(
              "block px-3 py-2 rounded-md hover-scale",
              isActive ? "bg-secondary/50" : "hover:bg-secondary/30"
            )
          }
          end={i.to === "/"}
        >
          {i.label}
        </NavLink>
      ))}
    </nav>
  );
};
