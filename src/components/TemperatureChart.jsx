import { useMemo, useState, useRef, useCallback } from "react";

function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours} ${ampm}`;
}

// Catmull-Rom spline → cubic bezier path for smooth, data-faithful curves
function catmullRomPath(pts, tension = 0.5) {
  if (pts.length < 2) return "";
  if (pts.length === 2) {
    return `M ${pts[0].x},${pts[0].y} L ${pts[1].x},${pts[1].y}`;
  }
  let path = `M ${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) * tension * 0.5;
    const cp1y = p1.y + (p2.y - p0.y) * tension * 0.5;
    const cp2x = p2.x - (p3.x - p1.x) * tension * 0.5;
    const cp2y = p2.y - (p3.y - p1.y) * tension * 0.5;
    path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return path;
}

export default function TemperatureChart({
  data = [],
  width = 600,
  height = 180,
  unit = "celsius",
  timeOfDay = "day",
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const svgRef = useRef(null);

  const isLight = timeOfDay === "day" || timeOfDay === "sunrise";

  const toDisplay = useCallback(
    (t) => (unit === "fahrenheit" ? Math.round((t * 9) / 5 + 32) : Math.round(t)),
    [unit]
  );
  const unitSymbol = unit === "fahrenheit" ? "°F" : "°C";

  // Theme-aware palette: one hue, proper contrast tokens, no gradient text
  const pal = useMemo(
    () =>
      isLight
        ? {
            line: "#f59e0b",          // amber-500
            lineGlow: "#fde68a",      // amber-200
            fillTop: "rgba(251,191,36,0.28)",
            fillBot: "rgba(251,191,36,0.0)",
            dotRing: "#ffffff",
            dotFill: "#f59e0b",
            dotHoverRing: "#fff7ed",
            crosshair: "#f59e0b",
            gridStroke: "rgba(15,23,42,0.08)",
            labelFg: "rgba(15,23,42,0.5)",
            tooltipBg: "rgba(15,23,42,0.94)",
            tooltipBorder: "rgba(255,255,255,0.12)",
            tooltipFg: "#ffffff",
            tooltipMuted: "rgba(255,255,255,0.55)",
            tooltipAccent: "#fbbf24",
            maxDot: "#ef4444",
            minDot: "#38bdf8",
          }
        : {
            line: "#38bdf8",          // sky-400
            lineGlow: "#7dd3fc",      // sky-300
            fillTop: "rgba(56,189,248,0.22)",
            fillBot: "rgba(56,189,248,0.0)",
            dotRing: "#0f172a",
            dotFill: "#38bdf8",
            dotHoverRing: "#0c4a6e",
            crosshair: "#38bdf8",
            gridStroke: "rgba(255,255,255,0.08)",
            labelFg: "rgba(255,255,255,0.45)",
            tooltipBg: "rgba(2,6,23,0.92)",
            tooltipBorder: "rgba(255,255,255,0.12)",
            tooltipFg: "#ffffff",
            tooltipMuted: "rgba(255,255,255,0.5)",
            tooltipAccent: "#38bdf8",
            maxDot: "#f87171",
            minDot: "#38bdf8",
          },
    [isLight]
  );

  const {
    points,
    linePath,
    areaPath,
    minTemp,
    maxTemp,
    maxIdx,
    minIdx,
    gridYs,
    pTop,
    pBot,
    pLeft,
    pRight,
  } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        points: [], linePath: "", areaPath: "",
        minTemp: 0, maxTemp: 0, maxIdx: -1, minIdx: -1,
        gridYs: [], pX: 36, pTop: 36, pBot: 28, pLeft: 44, pRight: 16,
      };
    }

    const temps = data.map((d) => toDisplay(d.temp));
    const rawMin = Math.min(...temps);
    const rawMax = Math.max(...temps);

    // Pad range by 15% so points never touch the top/bottom edge
    const rawRange = rawMax - rawMin || 4;
    const pad = rawRange * 0.18;
    const domainMin = rawMin - pad;
    const domainMax = rawMax + pad;
    const domain = domainMax - domainMin;

    const pLeft = 44;  // space for Y-axis labels
    const pRight = 16;
    const pTop = 40;   // space for max badge
    const pBot = 28;

    const chartW = width - pLeft - pRight;
    const chartH = height - pTop - pBot;

    const pts = data.map((d, i) => {
      const displayT = temps[i];
      const x = pLeft + (i / Math.max(1, data.length - 1)) * chartW;
      const y = pTop + chartH - ((displayT - domainMin) / domain) * chartH;
      return { x, y, displayTemp: displayT, time: d.time };
    });

    const lPath = catmullRomPath(pts, 0.4);

    // Close area at chart bottom baseline
    const baseY = pTop + chartH;
    const aPath = pts.length > 0
      ? `${lPath} L ${pts[pts.length - 1].x.toFixed(2)},${baseY} L ${pts[0].x.toFixed(2)},${baseY} Z`
      : "";

    const maxIdx = temps.indexOf(rawMax);
    const minIdx = temps.indexOf(rawMin);

    // 3 horizontal grid lines: min, mid, max of domain
    const midTemp = Math.round((rawMin + rawMax) / 2);
    const gridYs = [rawMax, midTemp, rawMin].map((t) => ({
      y: pTop + chartH - ((t - domainMin) / domain) * chartH,
      label: `${t}°`,
    }));

    return {
      points: pts,
      linePath: lPath,
      areaPath: aPath,
      minTemp: rawMin,
      maxTemp: rawMax,
      maxIdx,
      minIdx,
      gridYs,
      pTop,
      pBot,
      pLeft,
      pRight,
    };
  }, [data, width, height, toDisplay]);

  // Snap crosshair to nearest point via pointer position
  const handlePointerMove = useCallback(
    (e) => {
      if (!svgRef.current || points.length === 0) return;
      const rect = svgRef.current.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * width;
      let closest = 0, minDist = Infinity;
      points.forEach((pt, i) => {
        const d = Math.abs(pt.x - svgX);
        if (d < minDist) { minDist = d; closest = i; }
      });
      setHoveredIndex(closest);
    },
    [points, width]
  );

  const handlePointerLeave = useCallback(() => setHoveredIndex(null), []);

  if (!data || data.length === 0) return null;

  const hp = hoveredIndex !== null ? points[hoveredIndex] : null;
  const isMax = hoveredIndex === maxIdx;
  const isMin = hoveredIndex === minIdx;

  // Keep tooltip within SVG horizontal bounds
  const tooltipLeft = hp
    ? Math.min(Math.max((hp.x / width) * 100, 12), 88)
    : 50;

  return (
    <div className="relative w-full select-none" aria-hidden="false">
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible cursor-crosshair"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        role="img"
        aria-label={`Hourly temperature chart. Range: ${minTemp}${unitSymbol} to ${maxTemp}${unitSymbol}`}
      >
        <defs>
          {/* Area fill gradient */}
          <linearGradient id="tcAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={pal.fillTop} />
            <stop offset="100%" stopColor={pal.fillBot} />
          </linearGradient>

          {/* Line glow filter */}
          <filter id="tcLineGlow" x="-10%" y="-40%" width="120%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Dot highlight glow */}
          <filter id="tcDotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip so area fill doesn't overflow top */}
          <clipPath id="tcAreaClip">
            <rect x={pLeft} y={pTop} width={width - pLeft - pRight} height={height - pTop - pBot} />
          </clipPath>
        </defs>

        {/* ── Y-axis grid lines + labels ─────────────────── */}
        {gridYs.map((g, i) => (
          <g key={i}>
            <line
              x1={pLeft}
              y1={g.y}
              x2={width - pRight}
              y2={g.y}
              stroke={pal.gridStroke}
              strokeWidth="1"
            />
            <text
              x={pLeft - 8}
              y={g.y + 4}
              textAnchor="end"
              fill={pal.labelFg}
              fontSize="10"
              fontFamily="ui-monospace, 'SF Mono', monospace"
              fontVariantNumeric="tabular-nums"
            >
              {g.label}
            </text>
          </g>
        ))}

        {/* ── Area fill ──────────────────────────────────── */}
        <path
          d={areaPath}
          fill="url(#tcAreaGrad)"
          clipPath="url(#tcAreaClip)"
        />

        {/* ── Curve line ─────────────────────────────────── */}
        <path
          d={linePath}
          fill="none"
          stroke={pal.line}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#tcLineGlow)"
        />

        {/* ── Data point markers ─────────────────────────── */}
        {points.map((pt, i) => {
          const hov = hoveredIndex === i;
          const isMaxPt = i === maxIdx;
          const isMinPt = i === minIdx;
          const dotColor = isMaxPt ? pal.maxDot : isMinPt ? pal.minDot : pal.dotFill;
          const ringR = hov ? 7 : isMaxPt || isMinPt ? 6 : 4.5;
          const coreR = hov ? 4.5 : isMaxPt || isMinPt ? 3.5 : 2.5;

          return (
            <g key={i}>
              {/* Invisible 24px touch target */}
              <circle cx={pt.x} cy={pt.y} r={12} fill="transparent" />

              {/* Surface ring (separates dot from line) */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={ringR}
                fill={hov ? pal.dotHoverRing : pal.dotRing}
                filter={hov || isMaxPt || isMinPt ? "url(#tcDotGlow)" : undefined}
              />

              {/* Core dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={coreR}
                fill={hov ? dotColor : isMaxPt || isMinPt ? dotColor : pal.dotFill}
              />
            </g>
          );
        })}

        {/* ── Max / Min inline badges ─────────────────────── */}
        {points.length > 0 && maxIdx >= 0 && (() => {
          const pt = points[maxIdx];
          return (
            <g>
              <rect
                x={pt.x - 20}
                y={pt.y - 30}
                width={40}
                height={16}
                rx={8}
                fill={pal.maxDot}
                opacity={0.18}
              />
              <text
                x={pt.x}
                y={pt.y - 19}
                textAnchor="middle"
                fill={pal.maxDot}
                fontSize="10"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
              >
                {maxTemp}{unitSymbol}
              </text>
            </g>
          );
        })()}

        {points.length > 0 && minIdx >= 0 && minIdx !== maxIdx && (() => {
          const pt = points[minIdx];
          return (
            <g>
              <rect
                x={pt.x - 20}
                y={pt.y + 14}
                width={40}
                height={16}
                rx={8}
                fill={pal.minDot}
                opacity={0.18}
              />
              <text
                x={pt.x}
                y={pt.y + 25}
                textAnchor="middle"
                fill={pal.minDot}
                fontSize="10"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
              >
                {minTemp}{unitSymbol}
              </text>
            </g>
          );
        })()}

        {/* ── Crosshair vertical line ─────────────────────── */}
        {hp && (
          <line
            x1={hp.x}
            y1={pTop}
            x2={hp.x}
            y2={height - pBot}
            stroke={pal.crosshair}
            strokeWidth="1"
            strokeDasharray="3,3"
            opacity="0.55"
            pointerEvents="none"
          />
        )}
      </svg>

      {/* ── Hover tooltip ───────────────────────────────────── */}
      {hp && (
        <div
          className="absolute z-40 pointer-events-none"
          style={{
            left: `${tooltipLeft}%`,
            top: `${hp.y - 14}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xl backdrop-blur-xl"
            style={{
              background: pal.tooltipBg,
              border: `1px solid ${pal.tooltipBorder}`,
              color: pal.tooltipFg,
            }}
          >
            {/* Colored identity dot */}
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: pal.tooltipAccent }}
            />
            <span style={{ color: pal.tooltipMuted }}>{formatTime(hp.time)}</span>
            <span
              className="font-bold tabular-nums"
              style={{ color: pal.tooltipAccent }}
              dir="ltr"
            >
              {hp.displayTemp}{unitSymbol}
            </span>
            {isMax && (
              <span
                className="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                style={{ background: "rgba(239,68,68,0.2)", color: pal.maxDot }}
              >
                ↑ أعلى
              </span>
            )}
            {isMin && !isMax && (
              <span
                className="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                style={{ background: "rgba(56,189,248,0.2)", color: pal.minDot }}
              >
                ↓ أدنى
              </span>
            )}
          </div>
          {/* Arrow */}
          <div
            className="mx-auto w-2 h-1.5"
            style={{
              background: pal.tooltipBg,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              border: `1px solid ${pal.tooltipBorder}`,
            }}
          />
        </div>
      )}
    </div>
  );
}
