import { useEffect, useState } from "react";

// Time periods based on actual sun positions
const SUNRISE_START = 5;  // 5 AM
const SUNRISE_END = 8;    // 8 AM
const DAY_START = 8;      // 8 AM
const DAY_END = 17;       // 5 PM
const SUNSET_START = 17;  // 5 PM
const SUNSET_END = 20;    // 8 PM
const NIGHT_START = 20;   // 8 PM
const NIGHT_END = 5;      // 5 AM

export function getTimeOfDay(date = new Date()) {
  const hour = date.getHours();

  if (hour >= SUNRISE_START && hour < SUNRISE_END) {
    return "sunrise";
  } else if (hour >= DAY_START && hour < DAY_END) {
    return "day";
  } else if (hour >= SUNSET_START && hour < SUNSET_END) {
    return "sunset";
  } else {
    return "night";
  }
}

export default function useTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState(() => getTimeOfDay());

  useEffect(() => {
    const timer = setInterval(() => setTimeOfDay(getTimeOfDay()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return timeOfDay;
}
