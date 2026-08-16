import { useState, useCallback, useMemo } from "react";
import useTimeOfDay from "./useTimeOfDay";

const THEME_STORAGE_KEY = "weather-app-theme";

export function useTheme() {
  const actualTimeOfDay = useTimeOfDay();

  // Load saved theme from localStorage or default to "auto"
  const [savedTheme, setSavedTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(THEME_STORAGE_KEY) || "auto";
    }
    return "auto";
  });

  // timeOfDay is derived from savedTheme and actualTimeOfDay - no separate state needed
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

  const themes = [
    { value: "auto", label: "تلقائي", icon: "🌅" },
    { value: "sunrise", label: "شروق", icon: "🌄" },
    { value: "day", label: "نهار", icon: "☀️" },
    { value: "sunset", label: "غروب", icon: "🌇" },
    { value: "night", label: "ليل", icon: "🌙" },
  ];

  return { timeOfDay, handleThemeChange, themes, currentTheme: savedTheme };
}