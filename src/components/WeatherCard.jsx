import CurrentDate from "./CurrentDate";
import WeatherIcon from "./WeatherIcon";

function getThemeClasses(isDay) {
  return {
    card: isDay
      ? "bg-white/25 border border-white/40"
      : "bg-[#151e40]/85 border border-white/10",
    heading: isDay ? "text-slate-900" : "text-white",
    muted: isDay ? "text-slate-800/90" : "text-white/90",
    faint: isDay ? "text-slate-700/80" : "text-white/80",
    rule: isDay ? "border-slate-900/15" : "border-white/25",
    btn: isDay ? "text-slate-700" : "text-white",
    bar: isDay ? "bg-slate-600/30" : "bg-white/25",
  };
}

function WeatherCardSkeleton({ isDay }) {
  const { card, bar, rule } = getThemeClasses(isDay);

  return (
    <div className="flex flex-col w-full items-start max-w-sm">
      <div
        className={`w-full max-w-sm rounded-2xl ${card} backdrop-blur-lg p-6 animate-pulse`}
      >
        <div className={`h-10 w-32 rounded-lg ${bar}`} />
        <div className={`mt-4 h-3 w-40 rounded ${bar}`} />
        <hr className={`${rule} mt-4 mb-4`} />
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`h-14 w-16 rounded-xl ${bar}`} />
              <div className={`h-14 w-20 rounded-lg ${bar}`} />
            </div>
            <div className={`h-3 w-24 rounded ${bar}`} />
            <div className={`h-3 w-16 rounded ${bar}`} />
          </div>
          <div className={`h-24 w-24 rounded-2xl ${bar}`} />
        </div>
      </div>
    </div>
  );
}

function WeatherCardError({ isDay }) {
  const { card, muted } = getThemeClasses(isDay);

  return (
    <div className="flex flex-col w-full items-start max-w-sm">
      <div className={`w-full max-w-sm rounded-2xl ${card} backdrop-blur-lg p-6`}>
        <p className={`text-sm leading-relaxed ${muted}`}>
          تعذر تحميل بيانات الطقس. تحقق من اسم المدينة أو من اتصالك بالإنترنت.
        </p>
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
  const { card, heading, muted, faint, rule, btn } = getThemeClasses(isDay);

  return (
    <div className="flex flex-col w-full items-start max-w-sm">
      <div
        className={`w-full max-w-sm rounded-2xl ${card} backdrop-blur-lg shadow-2xl ${heading} p-6`}
      >
        {/* HEADER PART  */}
        <div>
          <h2 className={`text-5xl font-bold p-4 ${heading}`}>{cityName}</h2>
          <h3 className={`flex justify-end ${heading}`}>
            <CurrentDate />
          </h3>
          <hr className={`${rule} mt-4 mb-4`} />
        </div>
        {/* === HEADER PART === */}

        {/* BODY PART */}
        <div className="flex justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className={`text-6xl font-light ${heading}`}>{currentTemp}</h2>
              <WeatherIcon code={iconCode} size={56} variant="glyph" />
            </div>

            <p className={`text-sm my-1 ${muted}`}>{description}</p>

            <div className={`flex gap-2 text-xs ${faint}`}>
              <span>{minTemp}</span>
              <span>|</span>
              <span>{maxTemp}</span>
            </div>
          </div>

          <WeatherIcon code={iconCode} size={116} variant="scene" />
        </div>

        {/* === BODY PART === */}
      </div>
      {/*Translation BTN*/}
      <button
        className={`w-full flex justify-end text-xs pl-2 mt-2 cursor-pointer hover:opacity-80 ${btn}`}
      >
        انجليزي
      </button>
      {/* ===Translation BTN===*/}
    </div>
  );
}
