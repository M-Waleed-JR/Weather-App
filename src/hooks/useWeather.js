import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function useWeather(city, timeOfDay) {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchWeather = useCallback(async () => {
    if (!city) {
      setIsLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setIsLoading(true);
    setError(null);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      if (signal.aborted) return;

      try {
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
        setError(null);
        setIsLoading(false);
        return;
      } catch (err) {
        if (signal.aborted) return;

        const isLastAttempt = attempt === MAX_RETRIES;
        if (isLastAttempt || err.name === "CanceledError") {
          setError("تعذر تحميل بيانات الطقس");
          setIsLoading(false);
        } else {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt - 1)),
          );
        }
      }
    }
  }, [city]);

  useEffect(() => {
    if (city) {
      fetchWeather();
    } else {
      setIsLoading(false);
      setWeatherData(null);
      setError(null);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWeather, city]);

  return { weatherData, isLoading, error };
}
