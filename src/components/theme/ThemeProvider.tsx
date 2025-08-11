import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeName = "default" | "fantasy" | "nature" | "ocean" | "arthouse";

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "app_theme_v1";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
    return saved ?? "default";
  });

  useEffect(() => {
    // Default to dark palette as requested
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const classList = document.documentElement.classList;
    // remove all theme-* classes
    ["theme-default", "theme-fantasy", "theme-nature", "theme-ocean", "theme-arthouse"].forEach(c => classList.remove(c));
    classList.add(`theme-${theme}`);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme: setThemeState }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeName = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeName must be used within ThemeProvider");
  return ctx;
};
