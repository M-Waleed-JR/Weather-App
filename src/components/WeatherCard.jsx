import WeatherIcon from "./WeatherIcon";
import CurrentDate from "./CurrentDate";

function getThemeClasses(isDay) {
  return isDay
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

function WeatherCardSkeleton({ isDay }) {
  const { card } = getThemeClasses(isDay);

  return (
    <div className="w-full max-w-md">
      <div
        className={`w-full rounded-3xl ${card} backdrop-blur-xl border p-8 animate-pulse`}
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

function WeatherCardError({ isDay }) {
  const { card, muted } = getThemeClasses(isDay);

  return (
    <div className="w-full max-w-md">
      <div className={`w-full rounded-3xl ${card} backdrop-blur-xl border p-8`}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg
            className={`w-16 h-16 mb-4 ${muted}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
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
      <div className={`flex-shrink-0 ${accent}`}>{icon}</div>
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

export default function WeatherCard({ data, loading, error, isDay }) {
  if (loading) return <WeatherCardSkeleton isDay={isDay} />;
  if (error) return <WeatherCardError isDay={isDay} />;
  if (!data) return null;

  const { cityName, currentTemp, maxTemp, minTemp, description, iconCode } =
    data;
  const theme = getThemeClasses(isDay);
  const { card, heading, muted, faint, divider } = theme;

  return (
    <div className="w-full max-w-md">
      <div
        className={`w-full rounded-3xl ${card} backdrop-blur-xl border shadow-2xl p-8`}
      >
        {/* Header: City & Weather Condition */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className={`text-3xl font-bold ${heading}`}>{cityName}</h2>
            <p className={`text-base mt-1 ${muted}`}>{description}</p>
            <p className={`text-base mt-1 ${muted}`}>{CurrentDate()}</p>
          </div>
          <div className="weather-icon-animate">
            <WeatherIcon code={iconCode} size={64} isDay={isDay} />
          </div>
        </div>

        {/* Main Temperature Display */}
        <div className="flex items-end justify-center mb-8">
          <span className={`text-[10rem] font-bold  leading-none ${heading}`}>
            {currentTemp}
          </span>
          <span className={`text-3xl font-light mb-4 ${faint}`}>°م</span>
        </div>

        {/* Divider */}
        <div className={`h-px w-full ${divider} mb-6`} />

        {/* Weather Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            }
            label="العظمى"
            value={maxTemp}
            unit="°"
            theme={theme}
          />
          <StatCard
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            }
            label="الصغرى"
            value={minTemp}
            unit="°"
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}
