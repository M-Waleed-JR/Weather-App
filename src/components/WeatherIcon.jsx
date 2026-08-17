import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloud,
  WiCloudy,
  WiDayRain,
  WiNightAltRain,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
} from "react-icons/wi";

const ICON_MAP = {
  "01d": WiDaySunny,
  "01n": WiNightClear,
  "02d": WiDayCloudy,
  "02n": WiNightAltCloudy,
  "03d": WiCloud,
  "03n": WiCloud,
  "04d": WiCloudy,
  "04n": WiCloudy,
  "09d": WiRain,
  "09n": WiRain,
  "10d": WiDayRain,
  "10n": WiNightAltRain,
  "11d": WiThunderstorm,
  "11n": WiThunderstorm,
  "13d": WiSnow,
  "13n": WiSnow,
  "50d": WiFog,
  "50n": WiFog,
};

export default function WeatherIcon({ code, size = 56, timeOfDay = "day" }) {
  const Icon = ICON_MAP[code] || WiCloud;

  // Theme-aware colors
  const colors = {
    sunrise: "#F59E0B", // amber
    day: "#F59E0B", // amber
    sunset: "#FB923C", // orange
    night: "#38BDF8", // sky blue
  };

  const color = colors[timeOfDay] || colors.day;

  return (
    <div className="drop-shadow-lg">
      <Icon size={size} color={color} />
    </div>
  );
}
