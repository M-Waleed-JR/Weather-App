import { useState, useCallback, useMemo } from "react";
import useTimeOfDay from "./useTimeOfDay";

const THEME_STORAGE_KEY = "weather-app-theme";

const THEMES = [
  { value: "auto", label: "تلقائي", icon: "🌅" },
  { value: "sunrise", label: "شروق", icon: "🌄" },
  { value: "day", label: "نهار", icon: "☀️" },
  { value: "sunset", label: "غروب", icon: "🌇" },
  { value: "night", label: "ليل", icon: "🌙" },
];

export function useTheme() {
  const actualTimeOfDay = useTimeOfDay();

  const [savedTheme, setSavedTheme] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || "auto";
  });

  const timeOfDay = useMemo(() => {
    if (savedTheme === "auto") {
      return actualTimeOfDay;
    }
    return savedTheme;
  }, [savedTheme, actualTimeOfDay]);

  const handleThemeChange = useCallback((selectedTheme) => {
    setSavedTheme(selectedTheme);
    localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
  }, []);

  return { timeOfDay, handleThemeChange, themes: THEMES, currentTheme: savedTheme };
}
