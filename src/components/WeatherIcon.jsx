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

const DEFAULT_COLOR = "#fff";

export default function WeatherIcon({ code, size = 56, variant = "scene" }) {
  const Icon = ICON_MAP[code] || WiCloud;
  const color = variant === "glyph" ? undefined : DEFAULT_COLOR;

  return <Icon size={size} color={color} />;
}
