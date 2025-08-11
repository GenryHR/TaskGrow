import { useThemeName, ThemeName } from "./ThemeProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const THEME_LABELS: Record<ThemeName, string> = {
  default: "Стандартная (темная)",
  fantasy: "Фэнтези",
  nature: "Природа",
  ocean: "Пляж/океан",
  arthouse: "Артхаус",
};

export const ThemeSelector = () => {
  const { theme, setTheme } = useThemeName();
  return (
    <div className="w-56">
      <Select value={theme} onValueChange={(v) => setTheme(v as ThemeName)}>
        <SelectTrigger className="bg-secondary/50">
          <SelectValue placeholder="Тема оформления" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(THEME_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
