import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "e34faf2ef7f53a7ce32b21ff123d57f5";

export function useWeather(city, timeOfDay) {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(!!city);
  const [error, setError] = useState(false);

  const fetchWeather = useCallback(async () => {
    if (!city) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(false);

    try {
      // Check if city is coordinates (lat,lon format)
      const isCoordinates = /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(city.trim());
      const url = isCoordinates
        ? `https://api.openweathermap.org/data/2.5/forecast?lat=${city.split(",")[0]}&lon=${city.split(",")[1]}&appid=${API_KEY}&units=metric&lang=ar`
        : `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ar`;

      const res = await axios.get(url);

      const cityName = res.data.city.name;
      const currentTemp = Math.round(res.data.list[0].main.temp);
      const first8Hours = res.data.list.slice(0, 8);
      const allTemps = first8Hours.map((item) => item.main.temp);
      const maxTemp = Math.round(Math.max(...allTemps));
      const minTemp = Math.round(Math.min(...allTemps));
      let iconCode = res.data.list[0].weather[0].icon;
      const description = res.data.list[0].weather[0].description;

      // Override icon day/night suffix based on current theme
      const isNightTheme = timeOfDay === "night" || timeOfDay === "sunset";
      const iconBase = iconCode.slice(0, -1);
      iconCode = iconBase + (isNightTheme ? "n" : "d");

      setWeatherData({
        cityName,
        currentTemp,
        maxTemp,
        minTemp,
        description,
        iconCode,
      });
      setError(false);
    } catch {
      setError(true);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, [city, timeOfDay]);

  useEffect(() => {
    if (city) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchWeather();
    } else {
      setIsLoading(false);
      setWeatherData(null);
      setError(false);
    }
  }, [fetchWeather, city]);

  return { weatherData, isLoading, error, refetch: fetchWeather };
}