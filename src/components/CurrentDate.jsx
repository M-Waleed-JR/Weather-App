import { useState, useEffect } from "react";

export default function CurrentDate() {
  const [date, setDate] = useState(() =>
    new Date().toLocaleDateString("AR-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(
        new Date().toLocaleDateString("AR-EG", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return <span>{date}</span>;
}
