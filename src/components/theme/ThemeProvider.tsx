import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeName = "default" | "fantasy" | "nature" | "ocean" | "arthouse";

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "app_theme_v1";

// Safe localStorage functions
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error reading theme from localStorage:", error);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("Error writing theme to localStorage:", error);
  }
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = safeGetItem(THEME_STORAGE_KEY) as ThemeName | null;
    return saved ?? "default";
  });

  useEffect(() => {
    try {
      // Default to dark palette as requested
      document.documentElement.classList.add("dark");
    } catch (error) {
      console.error("Error setting default dark theme:", error);
    }
  }, []);

  useEffect(() => {
    try {
      const classList = document.documentElement.classList;
      // remove all theme-* classes
      ["theme-default", "theme-fantasy", "theme-nature", "theme-ocean", "theme-arthouse"].forEach(c => classList.remove(c));
      classList.add(`theme-${theme}`);
      safeSetItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Error applying theme:", error);
    }
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
