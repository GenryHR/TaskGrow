import { useThemeName, ThemeName } from "./ThemeProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/components/i18n/I18nProvider";

const THEME_LABELS: Record<ThemeName, string> = {
  default: "themeDefault",
  fantasy: "themeFantasy", 
  nature: "themeNature",
  ocean: "themeOcean",
  arthouse: "themeArthouse",
};

export const ThemeSelector = () => {
  const { theme, setTheme } = useThemeName();
  const { t } = useI18n();
  
  const getThemeLabel = (key: string) => {
    try {
      switch (key) {
        case "default": return t("themeDefault");
        case "fantasy": return t("themeFantasy");
        case "nature": return t("themeNature");
        case "ocean": return t("themeOcean");
        case "arthouse": return t("themeArthouse");
        default: return key;
      }
    } catch (error) {
      console.error("Error getting theme label:", error);
      return key;
    }
  };

  const handleThemeChange = (value: string) => {
    try {
      setTheme(value as ThemeName);
    } catch (error) {
      console.error("Error changing theme:", error);
    }
  };
  
  return (
    <div className="w-56">
      <Select value={theme} onValueChange={handleThemeChange}>
        <SelectTrigger className="bg-secondary/50">
          <SelectValue placeholder={t("theme")} />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(THEME_LABELS).map((value) => (
            <SelectItem key={value} value={value}>
              {getThemeLabel(value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
