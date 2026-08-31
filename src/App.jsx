import WeatherCard from "./components/WeatherCard";
import SearchBar from "./components/SearchBar";
import ThemeBackground from "./components/ThemeBackground";
import ThemeDebugger from "./components/ThemeDebugger";
import { useWeather } from "./hooks/useWeather";
import { useTheme } from "./hooks/useTheme";
import { ToastProvider } from "./context/ToastContext.jsx";
import { useState, useCallback, useEffect } from "react";

function App() {
  const { timeOfDay, handleThemeChange, themes, currentTheme } = useTheme();
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState(() => localStorage.getItem("weather-app-unit") || "celsius");

  const { weatherData, isLoading, error } = useWeather(city, timeOfDay);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCity(`${latitude},${longitude}`);
        },
        () => {
          setCity("cairo");
        },
      );
    } else {
      setCity("cairo");
    }
  }, []);

  const handleSearch = useCallback((newCity) => {
    setCity(newCity);
  }, []);

  const handleUnitToggle = useCallback(() => {
    setUnit((prev) => {
      const newUnit = prev === "celsius" ? "fahrenheit" : "celsius";
      localStorage.setItem("weather-app-unit", newUnit);
      return newUnit;
    });
  }, []);

  return (
    <ToastProvider>
      <main className="relative min-h-dvh overflow-hidden" dir="rtl">
        <ThemeBackground timeOfDay={timeOfDay} />
        <ThemeDebugger
          onTimeChange={handleThemeChange}
          themes={themes}
          currentTheme={currentTheme}
        />
        <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-7xl flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-8 py-8">
          <SearchBar onSearch={handleSearch} timeOfDay={timeOfDay} />
          <WeatherCard
            data={weatherData}
            loading={isLoading}
            error={error}
            timeOfDay={timeOfDay}
            unit={unit}
            onUnitToggle={handleUnitToggle}
          />
        </div>
      </main>
    </ToastProvider>
  );
}

export default App;
