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

        // Extract hourly forecast for the next 24 hours (8 intervals x 3 hours)
        const hourlyForecast = res.data.list.slice(0, 8).map((item) => ({
          time: item.dt,
          temp: Math.round(item.main.temp),
          iconCode: item.weather[0].icon,
          description: item.weather[0].description,
          humidity: item.main.humidity,
          windSpeed: Math.round(item.wind.speed * 3.6), // Convert m/s to km/h
          windDirection: item.wind.deg,
          feelsLike: Math.round(item.main.feels_like),
          rainProbability: Math.round((item.pop || 0) * 100), // Probability of precipitation (0-1 -> 0-100%)
        }));

        // Group forecast into daily forecasts
        const dailyForecast = Object.values(
          res.data.list.reduce((acc, item) => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!acc[date]) {
              acc[date] = {
                date: item.dt,
                minTemp: Math.round(item.main.temp),
                maxTemp: Math.round(item.main.temp),
                iconCode: item.weather[0].icon,
                hourly: [],
              };
            }
            acc[date].minTemp = Math.min(acc[date].minTemp, Math.round(item.main.temp));
            acc[date].maxTemp = Math.max(acc[date].maxTemp, Math.round(item.main.temp));
            acc[date].hourly.push({
              time: item.dt,
              temp: Math.round(item.main.temp),
              iconCode: item.weather[0].icon,
            });
            return acc;
          }, {})
        ).slice(0, 5); // Take 5 days

        // Generate weather advice based on conditions
        const currentWeather = res.data.list[0].weather[0].main.toLowerCase();
        const currentTempValue = Math.round(res.data.list[0].main.temp);
        const humidity = res.data.list[0].main.humidity;
        const windSpeed = Math.round(res.data.list[0].wind.speed * 3.6);

        let advice = "";
        if (currentWeather === "clear" && currentTempValue > 30) {
          advice = "طقس حار متوقع / يُنصح بشرب السوائل الباردة والبقاء في مكان مظلل وارتداء الملابس الخفيفة";
        } else if (currentWeather === "rain" || currentWeather === "drizzle") {
          advice = "أمطار خفيفة إلى متوسطة متوقعة / يُنصح بإحضار مظلتك وارتداء ملابس مقاومة للماء";
        } else if (currentWeather === "clouds") {
          advice = "طقس غائم بشكل جزئي / يمكن للخارج ممتعة مع عدم الحاجة لواقي شمس قوي";
        } else if (windSpeed > 30) {
          advice = "رياح قوية متوقعة / يُنصح بحذر عند القيادة وتجنب الأماكن المفتوحة";
        } else if (currentTempValue < 10) {
          advice = "طقس بارد / يُنصح بارتداء الملابس الدسمة والبقاء في الأماكن المدفأة";
        } else {
          advice = "طقس معتدل ومثالي للنشاطات الخارجية / استمتع بيوم جميل!";
        }

        setWeatherData({
          cityName,
          currentTemp,
          maxTemp,
          minTemp,
          description,
          iconCode,
          hourlyForecast,
          dailyForecast,
          advice,
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
