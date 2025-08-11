import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "ru" | "en";

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict["ru"]) => string;
};

const I18N_STORAGE_KEY = "app_lang_v1";

const dict = {
  ru: {
    appName: "GrowTasks",
    mainScreen: "Главный экран",
    allTasks: "Все задачи",
    completed: "Завершенные",
    garden: "Сад",
    settings: "Настройки",
    newTask: "Новая задача",
    editTask: "Редактировать задачу",
    taskPlaceholder: "Что нужно сделать?",
    cancel: "Отмена",
    addTask: "Добавить",
    save: "Сохранить",
    category: "Категория",
    empty: "Здесь пока пусто",
    today: "Сегодня",
    tomorrow: "Завтра",
    week: "Неделя",
    someday: "Когда-нибудь",
    addedToast: "Задача добавлена",
    deletedToast: "Удалено",
    language: "Язык",
    theme: "Тема",
  },
  en: {
    appName: "GrowTasks",
    mainScreen: "Home",
    allTasks: "All tasks",
    completed: "Completed",
    garden: "Garden",
    settings: "Settings",
    newTask: "New task",
    editTask: "Edit task",
    taskPlaceholder: "What needs to be done?",
    cancel: "Cancel",
    addTask: "Add",
    save: "Save",
    category: "Category",
    empty: "Nothing here yet",
    today: "Today",
    tomorrow: "Tomorrow",
    week: "Week",
    someday: "Someday",
    addedToast: "Task added",
    deletedToast: "Deleted",
    language: "Language",
    theme: "Theme",
  },
};

const I18nContext = createContext<I18nCtx | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem(I18N_STORAGE_KEY) as Lang) || "ru");

  useEffect(() => {
    localStorage.setItem(I18N_STORAGE_KEY, lang);
  }, [lang]);

  const t = useMemo(() => {
    const d = dict[lang];
    return (key: keyof typeof d) => d[key];
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
