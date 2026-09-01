import { useState, useMemo, useRef, useEffect } from "react";
import WeatherIcons from "./WeatherIcons";

const TABS = [
  { id: "weather", label: "الطقس", icon: "sun" },
  { id: "wind", label: "الرياح", icon: "wind" },
  { id: "humidity", label: "الرطوبة", icon: "droplet" },
  { id: "rain", label: "احتمالية الامطار", icon: "rain" },
];

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
        activeItem: "bg-slate-700 text-white shadow-lg shadow-slate-900/20",
        activeItemRing: "ring-1 ring-white/40",
        inactiveItem: "text-slate-700 hover:bg-white/20",
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
        activeItem: "bg-sky-500/80 text-white shadow-lg shadow-sky-500/30",
        activeItemRing: "ring-1 ring-white/25",
        inactiveItem: "text-white hover:bg-white/10",
      };
}

function overrideIconDayNight(iconCode, timeOfDay) {
  const isNight = timeOfDay === "night" || timeOfDay === "sunset";
  const base = iconCode.slice(0, -1);
  return base + (isNight ? "n" : "d");
}

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function formatHour(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();

  if (hours >= 5 && hours < 8) return "صباحاً";
  if (hours >= 8 && hours < 12) return "صباحاً";
  if (hours >= 12 && hours < 16) return "ظهراً";
  if (hours >= 16 && hours < 20) return "عصراً";
  if (hours >= 20 && hours < 24) return "مساءً";
  return "ليلاً";
}

function getWindDirection(degrees) {
  const directions = [
    "شمال",
    "شمال شرق",
    "شرق",
    "جنوب شرق",
    "جنوب",
    "جنوب غرب",
    "غرب",
    "شمال غرب",
  ];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function isCurrentlyActive(time) {
  const now = new Date();
  const forecastTime = new Date(time * 1000);
  const diffHours = (forecastTime - now) / (1000 * 60 * 60);
  return diffHours >= 0 && diffHours < 3;
}

// Tab & Navigation Icons
function SunIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function WindIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.7 7.7a2.5 2.5 0 111.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1111 8H2" />
      <path d="M12.6 19.4A2 2 0 1014 16H2" />
    </svg>
  );
}

function DropletIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
  );
}

function RainIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" />
      <line x1="8" y1="16" x2="8.01" y2="21" />
      <line x1="12" y1="18" x2="12.01" y2="23" />
      <line x1="16" y1="16" x2="16.01" y2="21" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

const TAB_ICONS = {
  weather: SunIcon,
  wind: WindIcon,
  humidity: DropletIcon,
  rain: RainIcon,
};

export default function HourlyForecast({
  forecast,
  timeOfDay,
  unit = "celsius",
}) {
  const [activeTab, setActiveTab] = useState("weather");
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const theme = getThemeClasses(timeOfDay);
  const {
    card,
    heading,
    faint,
    accent,
    activePill,
    activeTab: activeTabClass,
    inactiveTab,
    activeItem,
    activeItemRing,
    inactiveItem,
  } = theme;

  const toDisplay =
    unit === "fahrenheit" ? (t) => Math.round((t * 9) / 5 + 32) : (t) => t;

  const displayForecast = useMemo(() => {
    if (!forecast || forecast.length === 0) return [];
    return forecast.map((item) => ({
      ...item,
      isActive: isCurrentlyActive(item.time),
      displayIcon: overrideIconDayNight(item.iconCode, timeOfDay),
      timeLabel: formatTime(item.time),
      hourLabel: formatHour(item.time),
      windDirectionText: getWindDirection(item.windDirection),
    }));
  }, [forecast, timeOfDay]);

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
  }, [activeTab]);

  const scrollByAmount = (amount) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!displayForecast.length) return null;

  const renderCard = (item, index, icon, value, subLabel, extraLabel) => (
    <div
      key={item.time}
      className={`flex flex-col items-center min-w-[90px] px-3 py-4 rounded-2xl transition-all duration-300 select-none ${
        item.isActive
          ? `${activeItem} ${activeItemRing}`
          : `${inactiveItem} hover:-translate-y-0.5 active:scale-95`
      }`}
    >
      <span
        className={`text-xs font-medium mb-2 ${item.isActive ? "text-white" : faint}`}
      >
        {index === 0 ? "الآن" : item.hourLabel}
      </span>
      <span
        className={`text-[10px] mb-3 ${item.isActive ? "text-white/70" : "text-slate-400"}`}
      >
        {item.timeLabel}
      </span>
      <div className={`mb-3 ${item.isActive ? "text-white" : accent}`}>
        {icon}
      </div>
      <span
        className={`text-base font-bold ${item.isActive ? "text-white" : heading}`}
        dir="ltr"
      >
        {value}
      </span>
      {subLabel && (
        <span
          className={`text-[10px] ${item.isActive ? "text-white/70" : faint}`}
        >
          {subLabel}
        </span>
      )}
      {extraLabel && (
        <span
          className={`text-[9px] mt-1 ${item.isActive ? "text-white/60" : "text-slate-500"}`}
        >
          {extraLabel}
        </span>
      )}
    </div>
  );

  const renderContent = () => {
    const builders = {
      weather: (item) => ({
        icon: <WeatherIcons code={item.displayIcon} size={36} />,
        value: (
          <>
            {toDisplay(item.temp)}
            <span
              className={`text-[10px] font-semibold align-top ${item.isActive ? "text-white/70" : "text-slate-400"}`}
            >
              °{unit === "fahrenheit" ? "F" : "C"}
            </span>
          </>
        ),
      }),
      wind: (item) => ({
        icon: <WindIcon className="w-8 h-8" />,
        value: (
          <>
            {item.windSpeed}
            <span
              className={`text-[10px] font-normal ml-0.5 ${item.isActive ? "text-white/70" : faint}`}
            >
              km/h
            </span>
          </>
        ),
        extraLabel: item.windDirectionText,
      }),
      humidity: (item) => ({
        icon: <DropletIcon className="w-8 h-8" />,
        value: <>{item.humidity}%</>,
        subLabel: "رطوبة",
      }),
      rain: (item) => ({
        icon: <RainIcon className="w-8 h-8" />,
        value: <>{item.rainProbability}%</>,
        subLabel: "امطار",
      }),
    };

    const build = builders[activeTab] || builders.weather;

    return (
      <div className="flex gap-2 min-w-max py-4 px-3">
        {displayForecast.map((item, index) => {
          const { icon, value, subLabel, extraLabel } = build(item);
          return renderCard(item, index, icon, value, subLabel, extraLabel);
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl">
      <div
        className={`w-full rounded-3xl ${card} backdrop-blur-xl border shadow-2xl overflow-hidden`}
      >
        {/* Section Header with Pro Navigation Controls */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${theme.cardInner}`}
        >
          <h3 className={`text-lg font-bold ${heading}`}>
            توقعات الساعات القادمة
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollByAmount(-240)}
              aria-label="Previous hours"
              title="الساعات السابقة"
              className={`p-2 rounded-xl border border-white/10 transition-all duration-200 ${inactiveItem} active:scale-95 flex items-center justify-center`}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollByAmount(240)}
              aria-label="Next hours"
              title="الساعات التالية"
              className={`p-2 rounded-xl border border-white/10 transition-all duration-200 ${inactiveItem} active:scale-95 flex items-center justify-center`}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation — sliding-pill segmented control */}
        <div className={`relative flex p-1.5 ${theme.cardInner}`}>
          {/* Sliding active indicator */}
          <span
            aria-hidden="true"
            className={`absolute inset-y-1.5 rounded-xl ${activePill} transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`}
            style={{
              width: `calc(${100 / TABS.length}% - 6px)`,
              right: `calc(${(TABS.findIndex((t) => t.id === activeTab) * 100) / TABS.length}% + 3px)`,
            }}
          />
          {TABS.map((tab) => {
            const Icon = TAB_ICONS[tab.id];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                data-testid={`forecast-tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-semibold rounded-xl transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-400 ${
                  isActive ? activeTabClass : inactiveTab
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Pro Slider Container */}
        <div className="relative group/slider">
          {/* Left Side Floating Arrow (Visible on hover on Desktop) */}
          <button
            onClick={() => scrollByAmount(-240)}
            aria-label="Scroll left"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:flex items-center justify-center opacity-0 group-hover/slider:opacity-100"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          {/* Right Side Floating Arrow (Visible on hover on Desktop) */}
          <button
            onClick={() => scrollByAmount(240)}
            aria-label="Scroll right"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:flex items-center justify-center opacity-0 group-hover/slider:opacity-100"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>

          <div
            ref={scrollRef}
            key={activeTab}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`tab-rise overflow-x-auto scrollbar-hide select-none transition-all duration-150 ${
              isDraggingState ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
