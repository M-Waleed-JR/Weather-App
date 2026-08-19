import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

export function useWeather(city, timeOfDay) {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(!!city);
  const [error, setError] = useState(false);
  const abortControllerRef = useRef(null);

  const fetchWeather = useCallback(async () => {
    if (!city) {
      setIsLoading(false);
      return;
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setIsLoading(true);
    setError(false);

    // Retry logic with exponential backoff
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      if (signal.aborted) return;

      try {
        // Check if city is coordinates (lat,lon format)
        const isCoordinates = /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(city.trim());
        const url = isCoordinates
          ? `https://api.openweathermap.org/data/2.5/forecast?lat=${city.split(",")[0]}&lon=${city.split(",")[1]}&appid=${API_KEY}&units=metric&lang=ar`
          : `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ar`;

        const res = await axios.get(url, { signal });

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
        setIsLoading(false);
        return; // Success - exit the retry loop
      } catch (err) {
        if (signal.aborted) return;

        const isLastAttempt = attempt === MAX_RETRIES;
        if (isLastAttempt || err.name === "CanceledError") {
          setError(true);
          setWeatherData(null);
          setIsLoading(false);
        } else {
          // Wait before retrying (exponential backoff: 1s, 2s, 4s...)
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt - 1)));
        }
      }
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

    // Cleanup: abort on unmount or city change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWeather, city]);

  return { weatherData, isLoading, error, refetch: fetchWeather };
}