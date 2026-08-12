const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

const STARS = [
  [8, 14, 2, 0],
  [16, 32, 1.6, 0.9],
  [24, 8, 1.4, 1.7],
  [33, 20, 2.2, 0.4],
  [41, 38, 1.5, 2.3],
  [52, 12, 1.8, 1.2],
  [60, 27, 2.4, 0.1],
  [71, 8, 1.5, 2.8],
  [78, 34, 2, 0.7],
  [86, 18, 1.5, 1.9],
  [93, 42, 1.8, 0.3],
  [12, 48, 1.4, 2.1],
  [44, 52, 1.6, 1.5],
  [66, 46, 1.5, 2.6],
  [27, 58, 1.3, 0.6],
  [84, 54, 1.4, 3.1],
].map(([x, y, size, delay]) => ({ x, y, size, delay }));

function SunGlyph() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-40 w-40 drop-shadow-2xl sm:h-52 sm:w-52"
    >
      <defs>
        <radialGradient id="tgSunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd166" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="url(#tgSunGlow)" />
      <g className="tg-rays">
        {RAY_ANGLES.map((deg) => (
          <rect
            key={deg}
            x="96.5"
            y="40"
            width="7"
            height="14"
            rx="3.5"
            fill="#ffc95e"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </g>
      <circle cx="100" cy="100" r="34" fill="#ffd166" />
      <circle cx="88" cy="90" r="10" fill="#fff" opacity="0.35" />
    </svg>
  );
}

function MoonGlyph() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-36 w-36 drop-shadow-2xl sm:h-48 sm:w-48"
    >
      <defs>
        <radialGradient id="tgMoonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <mask id="tgCrescent">
          <rect width="200" height="200" fill="#fff" />
          <circle cx="117" cy="83" r="30" fill="#000" />
        </mask>
      </defs>
      <circle cx="100" cy="100" r="96" fill="url(#tgMoonGlow)" />
      <g className="tg-moon">
        <circle
          cx="100"
          cy="100"
          r="30"
          fill="#f2ecd9"
          mask="url(#tgCrescent)"
        />
        <circle cx="97" cy="104" r="2" fill="#cfc9b4" />
      </g>
    </svg>
  );
}

function Clouds({ variant }) {
  const positions =
    variant === "day"
      ? [
          "left-[6%] top-[18%] h-8 w-24 opacity-70",
          "left-[68%] top-[38%] h-10 w-32 opacity-50",
          "left-[40%] top-[10%] h-6 w-20 opacity-60",
        ]
      : [
          "left-[10%] top-[24%] h-8 w-24 opacity-[0.07]",
          "left-[64%] top-[44%] h-10 w-32 opacity-[0.05]",
          "left-[46%] top-[14%] h-6 w-20 opacity-[0.06]",
        ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {positions.map((pos, i) => (
        <span
          key={i}
          className={`tg-drift absolute rounded-full blur-xl ${
            variant === "day" ? "bg-white" : "bg-slate-100"
          } ${pos}`}
          style={{ animationDelay: `${i * 1.4}s` }}
        />
      ))}
    </div>
  );
}

export default function ThemeBackground({ isDay }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* DAY LAYER */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isDay ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#4aa3dd] via-[#a8ddf4] to-[#ffd98e]" />
        <div className="absolute left-1/2 top-6 -translate-x-1/2 opacity-80 sm:left-[70%]">
          <SunGlyph />
        </div>
        <Clouds variant="day" />
      </div>

      {/* NIGHT LAYER */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isDay ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b20] via-[#1a2150] to-[#2c2a55]" />
        <div className="absolute left-1/2 top-8 -translate-x-1/2 opacity-90 sm:left-[70%]">
          <MoonGlyph />
        </div>
        <div className="absolute inset-0">
          {STARS.map((star, i) => (
            <span
              key={i}
              className="tg-star absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
        <Clouds variant="night" />
      </div>
    </div>
  );
}
