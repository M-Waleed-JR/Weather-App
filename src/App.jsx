import WeatherCard from "./components/WeatherCard";
import SearchBar from "./components/SearchBar";
import ThemeBackground from "./components/ThemeBackground";
import ThemeDebugger from "./components/ThemeDebugger";
import { useWeather } from "./hooks/useWeather";
import { useTheme } from "./hooks/useTheme";
import { useState, useCallback, useEffect } from "react";

function App() {
  const { timeOfDay, handleThemeChange, themes, currentTheme } = useTheme();
  const [city, setCity] = useState("");
  const [isGeoLoading, setIsGeoLoading] = useState(true);
  const [unit, setUnit] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("weather-app-unit") || "celsius";
    }
    return "celsius";
  });

  const { weatherData, isLoading, error } = useWeather(city, timeOfDay);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCity(`${latitude},${longitude}`);
          setIsGeoLoading(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setCity("cairo");
          setIsGeoLoading(false);
        },
      );
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCity("cairo");
      setIsGeoLoading(false);
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
    <main className="relative min-h-dvh overflow-hidden" dir="rtl">
      <ThemeBackground timeOfDay={timeOfDay} />
      <ThemeDebugger
        onTimeChange={handleThemeChange}
        themes={themes}
        currentTheme={currentTheme}
      />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-8">
        <SearchBar onSearch={handleSearch} timeOfDay={timeOfDay} />
        <WeatherCard
          data={weatherData}
          loading={isLoading || isGeoLoading}
          error={error}
          timeOfDay={timeOfDay}
          unit={unit}
          onUnitToggle={handleUnitToggle}
        />
      </div>
    </main>
  );
}

export default App;
