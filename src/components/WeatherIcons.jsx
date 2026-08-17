import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ICON_MAP = {
  "01d": "clear-day",
  "01n": "clear-night",
  "02d": "partly-cloudy-day",
  "02n": "partly-cloudy-night",
  "03d": "cloudy",
  "03n": "cloudy",
  "04d": "overcast",
  "04n": "overcast",
  "09d": "rain",
  "09n": "rain",
  "10d": "partly-cloudy-day-rain",
  "10n": "partly-cloudy-night-rain",
  "11d": "thunderstorms",
  "11n": "thunderstorms",
  "13d": "snow",
  "13n": "snow",
  "50d": "fog",
  "50n": "fog",
};

export default function WeatherIcons({ code, size = 64 }) {
  const iconName = ICON_MAP[code] || "cloudy";
  const srcUrl = `https://cdn.jsdelivr.net/npm/@meteocons/lottie/fill/${iconName}.json`;

  return (
    <div style={{ width: size, height: size }} className="drop-shadow-lg flex items-center justify-center">
      <DotLottieReact src={srcUrl} loop autoplay />
    </div>
  );
}
