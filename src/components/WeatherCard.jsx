import CurrentDate from "./CurrentDate";
import WeatherIcons from "./WeatherIcons";
import { ChevronUpIcon, ChevronDownIcon, AlertCircleIcon } from "./Icons";

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
        divider: "bg-slate-200/60",
      }
    : {
        card: "bg-slate-900/40 border-white/10",
        cardInner: "bg-slate-800/40",
        heading: "text-white",
        muted: "text-slate-300",
        faint: "text-slate-400",
        accent: "text-sky-400",
        divider: "bg-white/10",
      };
}

function WeatherCardSkeleton({ timeOfDay }) {
  const { card } = getThemeClasses(timeOfDay);

  return (
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
      <div
        className={`w-full rounded-3xl ${card} backdrop-blur-xl border p-6 sm:p-8 animate-pulse`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-3">
            <div className="h-6 w-32 rounded-lg bg-white/20" />
            <div className="h-4 w-24 rounded bg-white/20" />
          </div>
          <div className="h-10 w-10 rounded-full bg-white/20" />
        </div>
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-3">
            <div className="h-16 w-28 rounded-xl bg-white/20" />
            <div className="h-4 w-32 rounded bg-white/20" />
          </div>
          <div className="h-24 w-24 rounded-2xl bg-white/20" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 rounded-2xl bg-white/20" />
          <div className="h-20 rounded-2xl bg-white/20" />
        </div>
      </div>
    </div>
  );
}

function WeatherCardError({ timeOfDay }) {
  const { card, muted } = getThemeClasses(timeOfDay);

  return (
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
      <div
        className={`w-full rounded-3xl ${card} backdrop-blur-xl border p-6 sm:p-8`}
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircleIcon className={`${muted}`} />
          <p className={`text-lg font-medium ${muted}`}>
            تعذر تحميل بيانات الطقس
          </p>
          <p className={`text-sm mt-1 ${muted}`}>
            تحقق من اسم المدينة أو اتصالك بالإنترنت
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, unit, theme }) {
  const { cardInner, heading, faint, accent } = theme;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl ${cardInner} backdrop-blur-sm`}
    >
      <div className={`shrink-0 ${accent}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs uppercase tracking-wider font-medium ${faint}`}>
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          <span className={`text-xl font-semibold ${heading}`}>{value}</span>
          {unit && <span className={`text-sm ${faint}`}>{unit}</span>}
        </div>
      </div>
    </div>
  );
}

function toFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

function overrideIconDayNight(iconCode, timeOfDay) {
  const isNight = timeOfDay === "night" || timeOfDay === "sunset";
  const base = iconCode.slice(0, -1);
  return base + (isNight ? "n" : "d");
}

export default function WeatherCard({
  data,
  loading,
  error,
  timeOfDay,
  unit = "celsius",
  onUnitToggle,
}) {
  if (loading) return <WeatherCardSkeleton timeOfDay={timeOfDay} />;
  if (error) return <WeatherCardError timeOfDay={timeOfDay} />;
  if (!data) return null;

  const { cityName, currentTemp, maxTemp, minTemp, description, iconCode } =
    data;
  const theme = getThemeClasses(timeOfDay);
  const { card, heading, muted, faint, divider } = theme;
  const isLight = timeOfDay === "day" || timeOfDay === "sunrise";

  const toDisplay = unit === "fahrenheit" ? toFahrenheit : (t) => t;
  const unitSymbol = unit === "fahrenheit" ? "°F" : "°C";
  const displayIcon = overrideIconDayNight(iconCode, timeOfDay);

  return (
    <div className="w-full max-w-2xl">
      <div
        className={`w-full rounded-3xl ${card} backdrop-blur-xl border shadow-2xl p-6 sm:p-8`}
      >
        {/* Header: City & Weather Condition */}
        <div className="flex items-start justify-between mb-6 sm:mb-8">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-bold ${heading}`}>
              {cityName}
            </h2>
            <p className={`text-base mt-1 ${muted}`}>{description}</p>
            <p className={`text-base mt-1 ${muted}`}>
              <CurrentDate />
            </p>
          </div>
          <div className="weather-icon-animate">
            <WeatherIcons code={displayIcon} size={64} />
          </div>
        </div>

        {/* Main Temperature Display */}
        <div className="flex items-end justify-center mb-6 sm:mb-8" dir="ltr">
          <span
            className={`text-6xl sm:text-7xl lg:text-8xl font-bold leading-none ${heading}`}
          >
            {toDisplay(currentTemp)}
          </span>
          <span className={`text-2xl sm:text-3xl font-bold mb-4 ${faint}`}>
            {unitSymbol}
          </span>
        </div>

        {/* Unit Toggle */}
        {onUnitToggle && (
          <div className="flex justify-center mb-6">
            <button
              onClick={onUnitToggle}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                unit === "celsius"
                  ? isLight
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-sky-500 text-white hover:bg-sky-600"
                  : isLight
                    ? "bg-white/50 text-slate-700 hover:bg-white/70"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
              aria-label={`تغيير الوحدة إلى ${unit === "celsius" ? "فهرنهايت" : "مئوية"}`}
            >
              {unit === "celsius" ? "°F" : "°C"}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className={`h-px w-full ${divider} mb-6`} />

        {/* Weather Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={<ChevronUpIcon />}
            label="العظمى"
            value={toDisplay(maxTemp)}
            unit="°"
            theme={theme}
          />
          <StatCard
            icon={<ChevronDownIcon />}
            label="الصغرى"
            value={toDisplay(minTemp)}
            unit="°"
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}
