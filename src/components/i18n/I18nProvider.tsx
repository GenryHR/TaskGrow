import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "ru" | "en";

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict["ru"]) => string;
};

const I18N_STORAGE_KEY = "app_lang_v1";

// Safe localStorage functions
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("Error reading language from localStorage:", error);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("Error writing language to localStorage:", error);
  }
};

const dict = {
  ru: {
    appName: "GrowTasks",
    mainScreen: "Главный экран",
    allTasks: "Все задачи",
    completed: "Завершенные",
    garden: "Сад",
    settings: "Настройки",
    trash: "Корзина",
    newTask: "Новая задача",
    editTask: "Редактировать задачу",
    taskPlaceholder: "Что нужно сделать?",
    description: "Описание (необязательно)",
    priority: "Приоритет",
    priorityLow: "Низкий",
    priorityMedium: "Средний", 
    priorityHigh: "Высокий",
    dueDate: "Срок выполнения",
    selectDate: "Выбрать дату",
    cancel: "Отмена",
    addTask: "Добавить",
    save: "Сохранить",
    restore: "Восстановить",
    delete: "Удалить",
    clearTrash: "Очистить корзину",
    category: "Категория",
    empty: "Здесь пока пусто",
    trashEmpty: "Корзина пуста",
    today: "Сегодня",
    tomorrow: "Завтра",
    week: "Неделя",
    someday: "Когда-нибудь",
    addedToast: "Задача добавлена",
    deletedToast: "Удалено",
    restoredToast: "Восстановлено",
    language: "Язык",
    theme: "Тема",
    themeDefault: "Стандартная (темная)",
    themeFantasy: "Фэнтези",
    themeNature: "Природа",
    themeOcean: "Пляж/океан",
    themeArthouse: "Артхаус",
    gardenTitle: "Ваш цифровой сад",
    gardenDescription: "Каждая выполненная задача помогает вашему саду расти. От семечка до могучего дерева!",
    gardenEmpty: "Выполните первую задачу, чтобы посадить семечко!",
    gardenProgress: "Завершено задач",
    gardenCongrats: "Поздравляем! Ваш сад превратился в лес!",
    completedAt: "Выполнено",
    completedToday: "Выполнено сегодня",
    morePlants: "больше растений в вашем саду!",
    deletedAt: "Удалено",
  },
  en: {
    appName: "GrowTasks",
    mainScreen: "Home",
    allTasks: "All tasks",
    completed: "Completed",
    garden: "Garden",
    settings: "Settings",
    trash: "Trash",
    newTask: "New task",
    editTask: "Edit task",
    taskPlaceholder: "What needs to be done?",
    description: "Description (optional)",
    priority: "Priority",
    priorityLow: "Low",
    priorityMedium: "Medium",
    priorityHigh: "High",
    dueDate: "Due date",
    selectDate: "Select date",
    cancel: "Cancel",
    addTask: "Add",
    save: "Save",
    restore: "Restore",
    delete: "Delete",
    clearTrash: "Clear trash",
    category: "Category",
    empty: "Nothing here yet",
    trashEmpty: "Trash is empty",
    today: "Today",
    tomorrow: "Tomorrow",
    week: "Week",
    someday: "Someday",
    addedToast: "Task added",
    deletedToast: "Deleted",
    restoredToast: "Restored",
    language: "Language",
    theme: "Theme",
    themeDefault: "Default (dark)",
    themeFantasy: "Fantasy",
    themeNature: "Nature",
    themeOcean: "Beach/ocean",
    themeArthouse: "Arthouse",
    gardenTitle: "Your digital garden",
    gardenDescription: "Each completed task helps your garden grow. From seed to mighty tree!",
    gardenEmpty: "Complete your first task to plant a seed!",
    gardenProgress: "Tasks completed",
    gardenCongrats: "Congratulations! Your garden has become a forest!",
    completedAt: "Completed",
    completedToday: "Completed today",
    morePlants: "more plants in your garden!",
    deletedAt: "Deleted",
  },
};

const I18nContext = createContext<I18nCtx | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = safeGetItem(I18N_STORAGE_KEY) as Lang | null;
    return saved ?? "ru";
  });

  useEffect(() => {
    safeSetItem(I18N_STORAGE_KEY, lang);
  }, [lang]);

  const t = useMemo(() => {
    try {
      const d = dict[lang];
      return (key: keyof typeof d) => {
        if (key in d) {
          return d[key];
        }
        console.warn(`Translation key not found: ${key}`);
        return key;
      };
    } catch (error) {
      console.error("Error in translation function:", error);
      return (key: string) => key;
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    try {
      if (l in dict) {
        setLangState(l);
      } else {
        console.warn(`Invalid language: ${l}`);
      }
    } catch (error) {
      console.error("Error setting language:", error);
    }
  };

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
