import React, { useMemo } from 'react';

const TemperatureChart = ({ data, width = 800, height = 200 }) => {
  const { points, areaPath, gradientStops } = useMemo(() => {
    if (!data || data.length === 0) return { points: '', areaPath: '', gradientStops: [] };

    const temps = data.map(d => d.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const range = maxTemp - minTemp || 1;
    const padding = 20;
    const chartHeight = height - padding * 2;
    const chartWidth = width;

    // Create smooth curve points using quadratic bezier
    const pointPairs = data.map((d, i) => {
      const x = (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((d.temp - minTemp) / range) * chartHeight;
      return { x, y };
    });

    // Generate smooth path using bezier curves
    const getPath = (pts, tension = 0.3) => {
      if (pts.length < 2) return '';

      let path = `M ${pts[0].x},${pts[0].y}`;

      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) * tension;
        const cp1y = p1.y + (p2.y - p0.y) * tension;
        const cp2x = p2.x - (p3.x - p1.x) * tension;
        const cp2y = p2.y - (p3.y - p1.y) * tension;

        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }

      return path;
    };

    const linePath = getPath(pointPairs);
    const areaPath = `${linePath} L ${pointPairs[pointPairs.length - 1].x},${height} L ${pointPairs[0].x},${height} Z`;

    // Create gradient stops based on temperature
    const stops = temps.map((temp, i) => {
      const offset = (i / (temps.length - 1)) * 100;
      let color;
      if (temp > 30) color = 'rgba(239, 68, 68,'; // Red
      else if (temp > 20) color = 'rgba(245, 158, 11,'; // Amber
      else if (temp > 10) color = 'rgba(16, 185, 129,'; // Emerald
      else color = 'rgba(59, 130, 246,'; // Blue
      return { offset, color };
    });

    return {
      points: pointPairs.map(p => `${p.x},${p.y}`).join(' '),
      areaPath,
      gradientStops: stops
    };
  }, [data, width, height]);

  if (!data || data.length === 0) return null;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      preserveAspectRatio="none"
      role="img"
      aria-label="مخطط درجة الحرارة على مدار الساعة"
    >
      <defs>
        {/* Main gradient fill */}
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0.1)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>

        {/* Warm gradient for hot temperatures */}
        <linearGradient id="warmGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(239, 68, 68, 0.6)" />
          <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
        </linearGradient>

        {/* Cool gradient for cold temperatures */}
        <linearGradient id="coolGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      <g className="grid-lines" opacity="0.1">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1="0"
            y1={height * ratio}
            x2={width}
            y2={height * ratio}
            stroke="white"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        ))}
      </g>

      {/* Area fill */}
      <path
        d={areaPath}
        fill="url(#chartGradient)"
        className="transition-all duration-500"
      />

      {/* Line path */}
      <path
        d={points.replace(/,/g, ' ').split(' ').filter((_, i) => i % 2 === 0).length > 2
          ? `M ${points}`
          : points}
        fill="none"
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        className="transition-all duration-500"
      />

      {/* Data points */}
      {data.map((d, i) => {
        const temps = data.map(dd => dd.temp);
        const minT = Math.min(...temps);
        const maxT = Math.max(...temps);
        const rangeT = maxT - minT || 1;
        const padding = 20;
        const chartHeight = height - padding * 2;
        const chartWidth = width;
        const x = (i / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((d.temp - minT) / rangeT) * chartHeight;

        return (
          <g key={i} className="point-group">
            {/* Invisible touch target */}
            <circle
              cx={x}
              cy={y}
              r="16"
              fill="transparent"
              className="cursor-pointer"
            />
            {/* Visible dot */}
            <circle
              cx={x}
              cy={y}
              r="4"
              fill="white"
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth="2"
              className="transition-all duration-200"
            />
          </g>
        );
      })}
    </svg>
  );
};

export default TemperatureChart;
