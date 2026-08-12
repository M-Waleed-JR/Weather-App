import WeatherCard from "./components/WeatherCard";
import SearchBar from "./components/SearchBar";
import ThemeBackground from "./components/ThemeBackground";
import useTimeOfDay from "./hooks/useTimeOfDay";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_KEY = "e34faf2ef7f53a7ce32b21ff123d57f5";

function App() {
  const isDay = useTimeOfDay();
  const [city, setCity] = useState("cairo");
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleSearch = useCallback((newCity) => {
    setCity(newCity);
  }, []);

  useEffect(() => {
    if (!city) return;

    let cancelled = false;

    setIsLoading(false);
    setError(false);

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ar`,
      )
      .then((res) => {
        if (cancelled) return;

        const cityName = res.data.city.name;
        const currentTemp = Math.round(res.data.list[0].main.temp);
        const first8Hours = res.data.list.slice(0, 8);
        const allTemps = first8Hours.map((item) => item.main.temp);
        const maxTemp = Math.round(Math.max(...allTemps));
        const minTemp = Math.round(Math.min(...allTemps));
        const iconCode = res.data.list[0].weather[0].icon;
        const description = res.data.list[0].weather[0].description;

        setWeatherData({
          cityName,
          currentTemp,
          maxTemp,
          minTemp,
          description,
          iconCode,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setWeatherData(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ThemeBackground isDay={isDay} />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <SearchBar onSearch={handleSearch} isDay={isDay} />
        <WeatherCard
          data={weatherData}
          loading={isLoading}
          error={error}
          isDay={isDay}
        />
      </div>
    </main>
  );
}

export default App;
