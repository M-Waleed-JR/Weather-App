import React, { useState, useRef, useEffect, useMemo } from "react";
import WeatherIcons from "./WeatherIcons";
import TemperatureChart from "./TemperatureChart";

function getThemeClasses(timeOfDay) {
  const isLight = timeOfDay === "day" || timeOfDay === "sunrise";

  return isLight
    ? {
        card: "bg-white/30 border-white/40",
        cardInner: "bg-white/40",
        heading: "text-slate-800",
        muted: "text-slate-600",
        faint: "text-slate-500",
        accent: "text-amber-500",
        activePill: "bg-slate-700 shadow-lg shadow-slate-900/25",
        activeTab: "text-white",
        inactiveTab: "text-slate-600 hover:text-slate-900",
        activeItem: "bg-slate-700 text-white shadow-lg shadow-slate-900/20 ring-1 ring-white/40",
        inactiveItem: "text-slate-700 hover:bg-white/20 border-white/20",
        barTrack: "bg-slate-900/10",
        tempBar: "from-amber-400 to-sky-500",
      }
    : {
        card: "bg-slate-900/40 border-white/10",
        cardInner: "bg-slate-800/40",
        heading: "text-white",
        muted: "text-slate-300",
        faint: "text-slate-400",
        accent: "text-sky-400",
        activePill: "bg-sky-500/90 shadow-lg shadow-sky-500/40",
        activeTab: "text-white",
        inactiveTab: "text-slate-300 hover:text-white",
        activeItem: "bg-sky-500/80 text-white shadow-lg shadow-sky-500/30 ring-1 ring-white/25",
        inactiveItem: "text-white hover:bg-white/10 border-white/10",
        barTrack: "bg-white/10",
        tempBar: "from-sky-400 to-amber-400",
      };
}

function overrideIconDayNight(iconCode, timeOfDay) {
  const isNight = timeOfDay === "night" || timeOfDay === "sunset";
  const base = iconCode.slice(0, -1);
  return base + (isNight ? "n" : "d");
}

function formatDayName(timestamp, index) {
  if (index === 0) return "اليوم";
  if (index === 1) return "غداً";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("ar-EG", { weekday: "long" });
}

function formatDateSub(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
}

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours} ${ampm}`;
}

function ChevronLeftIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function DailyForecast({ dailyForecast, timeOfDay, unit = "celsius" }) {
  const [activeDay, setActiveDay] = useState(0);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const theme = getThemeClasses(timeOfDay);
  const { card, cardInner, heading, muted, faint, accent, activeItem, inactiveItem, barTrack, tempBar } = theme;

  const toDisplay = unit === "fahrenheit" ? (t) => Math.round((t * 9) / 5 + 32) : (t) => t;
  const unitSymbol = unit === "fahrenheit" ? "°F" : "°C";

  // Calculate global min and max across all days for the thermal range bar
  const { overallMin, overallMax, range } = useMemo(() => {
    if (!dailyForecast || dailyForecast.length === 0) {
      return { overallMin: 0, overallMax: 100, range: 1 };
    }
    const mins = dailyForecast.map((d) => d.minTemp);
    const maxs = dailyForecast.map((d) => d.maxTemp);
    const min = Math.min(...mins);
    const max = Math.max(...maxs);
    return { overallMin: min, overallMax: max, range: max - min || 1 };
  }, [dailyForecast]);

  // Handle Mouse Drag for PC
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    setIsDraggingState(true);
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftPos.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      setIsDraggingState(false);
    }
  };

  // Handle Mouse Wheel horizontal scrolling
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const scrollByAmount = (amount) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!dailyForecast || dailyForecast.length === 0) return null;

  const activeDayData = dailyForecast[activeDay] || dailyForecast[0];

  return (
    <div className="w-full max-w-2xl">
      <div className={`w-full rounded-3xl ${card} backdrop-blur-xl border shadow-2xl overflow-hidden`}>
        {/* Section Header with Pro Navigation Controls */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${cardInner}`}>
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-bold ${heading}`}>توقعات الأيام القادمة</h3>
            <span className={`text-xs px-2.5 py-1 rounded-full bg-white/10 font-semibold ${muted}`}>
              5 أيام
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollByAmount(-220)}
              aria-label="Previous day"
              title="السابق"
              className={`p-2 rounded-xl border transition-all duration-200 ${inactiveItem} active:scale-95 flex items-center justify-center`}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollByAmount(220)}
              aria-label="Next day"
              title="التالي"
              className={`p-2 rounded-xl border transition-all duration-200 ${inactiveItem} active:scale-95 flex items-center justify-center`}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Cards Slider */}
        <div className="relative group/slider p-4 border-b border-white/5">
          {/* Floating Hover Arrows */}
          <button
            onClick={() => scrollByAmount(-220)}
            aria-label="Scroll left"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:flex items-center justify-center opacity-0 group-hover/slider:opacity-100"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollByAmount(220)}
            aria-label="Scroll right"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:flex items-center justify-center opacity-0 group-hover/slider:opacity-100"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex gap-3 overflow-x-auto scrollbar-hide select-none py-1 px-1 transition-all duration-150 ${
              isDraggingState ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {dailyForecast.map((day, index) => {
              const isActive = activeDay === index;
              const dayTitle = formatDayName(day.date, index);
              const dateSubtitle = formatDateSub(day.date);
              const icon = overrideIconDayNight(day.iconCode, timeOfDay);

              // Temperature bar percentage calculations
              const leftPercent = ((day.minTemp - overallMin) / range) * 100;
              const widthPercent = Math.max(20, ((day.maxTemp - day.minTemp) / range) * 100);

              return (
                <button
                  key={day.date || index}
                  onClick={() => setActiveDay(index)}
                  className={`flex-shrink-0 flex flex-col items-center justify-between min-w-[130px] p-4 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? `${activeItem} scale-[1.02] shadow-xl`
                      : `${inactiveItem} hover:-translate-y-0.5 active:scale-95`
                  }`}
                >
                  {/* Top Labels */}
                  <div className="text-center mb-2">
                    <span className={`block text-sm font-bold ${isActive ? "text-white" : heading}`}>
                      {dayTitle}
                    </span>
                    <span className={`text-[11px] font-medium ${isActive ? "text-white/70" : faint}`}>
                      {dateSubtitle}
                    </span>
                  </div>

                  {/* Weather Icon */}
                  <div className="my-2 transition-transform duration-300 hover:scale-110">
                    <WeatherIcons code={icon} size={42} />
                  </div>

                  {/* Temperature Range & Bar */}
                  <div className="w-full mt-2">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5" dir="ltr">
                      <span className={isActive ? "text-white" : heading}>
                        {toDisplay(day.maxTemp)}°
                      </span>
                      <span className={isActive ? "text-white/60" : faint}>
                        {toDisplay(day.minTemp)}°
                      </span>
                    </div>

                    {/* Pro Temperature Range Bar */}
                    <div className={`relative h-1.5 w-full rounded-full overflow-hidden ${barTrack}`}>
                      <div
                        className={`absolute top-0 bottom-0 rounded-full bg-gradient-to-r ${tempBar}`}
                        style={{
                          right: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Detailed Breakdown & Temperature Curve */}
        <div className={`p-6 ${cardInner}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${faint}`}>
                تفاصيل اليوم
              </span>
              <h4 className={`text-lg font-bold ${heading}`}>
                {formatDayName(activeDayData.date, activeDay)} - {formatDateSub(activeDayData.date)}
              </h4>
            </div>
            <div className="flex items-center gap-3">
              <WeatherIcons code={overrideIconDayNight(activeDayData.iconCode, timeOfDay)} size={48} />
              <div className="text-left" dir="ltr">
                <span className={`text-2xl font-extrabold ${heading}`}>
                  {toDisplay(activeDayData.maxTemp)}{unitSymbol}
                </span>
                <span className={`block text-xs font-medium ${faint}`}>
                  الصغرى: {toDisplay(activeDayData.minTemp)}{unitSymbol}
                </span>
              </div>
            </div>
          </div>

          {/* Temperature Chart */}
          {activeDayData.hourly && activeDayData.hourly.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="mb-2 flex items-center justify-between">
                <span className={`text-xs font-semibold ${muted}`}>
                  مسار درجة الحرارة على مدار اليوم
                </span>
              </div>

              <div className="relative h-32 w-full my-2">
                <TemperatureChart data={activeDayData.hourly} width={600} height={120} />
              </div>

              {/* Clean Non-overlapping Hourly Strip */}
              <div className="flex justify-between items-center overflow-x-auto scrollbar-hide gap-2 pt-2">
                {activeDayData.hourly.map((h, i) => (
                  <div key={i} className="flex flex-col items-center min-w-[50px] p-1.5 rounded-xl bg-white/5">
                    <span className={`text-[10px] font-medium mb-1 ${faint}`}>
                      {formatTime(h.time)}
                    </span>
                    <WeatherIcons code={overrideIconDayNight(h.iconCode, timeOfDay)} size={22} />
                    <span className={`text-xs font-bold mt-1 ${heading}`} dir="ltr">
                      {toDisplay(h.temp)}°
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
