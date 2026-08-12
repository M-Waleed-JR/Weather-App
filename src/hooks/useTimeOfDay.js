import { useEffect, useState } from "react";

const DAY_START_HOUR = 6;
const DAY_END_HOUR = 18;

export function getIsDay(date = new Date()) {
  const hour = date.getHours();
  return hour >= DAY_START_HOUR && hour < DAY_END_HOUR;
}

export default function useTimeOfDay() {
  const [isDay, setIsDay] = useState(() => getIsDay());

  useEffect(() => {
    const timer = setInterval(() => setIsDay(getIsDay()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return isDay;
}
