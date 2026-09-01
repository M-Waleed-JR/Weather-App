import { useRef, useEffect, useMemo } from "react";

const THEME_CONFIG = {
  sunrise: {
    video: "Themes/sunrise.mp4",
    poster: "Themes/sunrise-poster.svg",
    objectPosition: "72% 58%",
    sunGlow:
      "radial-gradient(ellipse 65% 55% at 72% 58%, rgba(253, 230, 138, 0.38) 0%, rgba(251, 146, 60, 0.2) 32%, rgba(56, 189, 248, 0.08) 65%, transparent 80%)",
    skyGradient: "bg-gradient-to-b from-[#1e1b4b] via-[#c2410c] to-[#fde047]",
    vignette:
      "linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.05) 40%, rgba(15,23,42,0.25) 100%)",
  },
  sunset: {
    video: "Themes/sunset.mp4",
    poster: "Themes/sunset-poster.svg",
    objectPosition: "72% 55%",
    sunGlow:
      "radial-gradient(ellipse 65% 55% at 72% 55%, rgba(254, 215, 170, 0.35) 0%, rgba(225, 29, 72, 0.22) 35%, rgba(88, 28, 135, 0.15) 68%, transparent 85%)",
    skyGradient: "bg-gradient-to-b from-[#0f172a] via-[#831843] to-[#ea580c]",
    vignette:
      "linear-gradient(180deg, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0.05) 40%, rgba(15,23,42,0.35) 100%)",
  },
  day: {
    video: "Themes/Day.mp4",
    poster: "Themes/day-poster.svg",
    objectPosition: "center 35%",
    sunGlow:
      "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(255, 255, 255, 0.22) 0%, rgba(56, 189, 248, 0.12) 45%, transparent 75%)",
    skyGradient: "bg-gradient-to-b from-[#0284c7] via-[#38bdf8] to-[#bae6fd]",
    vignette:
      "linear-gradient(180deg, rgba(14,116,144,0.15) 0%, transparent 40%, rgba(14,116,144,0.15) 100%)",
  },
  night: {
    video: "Themes/Night.mp4",
    poster: "Themes/night-poster.svg",
    objectPosition: "center 30%",
    sunGlow:
      "radial-gradient(ellipse 60% 50% at 75% 25%, rgba(224, 231, 255, 0.18) 0%, rgba(99, 102, 241, 0.08) 40%, transparent 70%)",
    skyGradient: "bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]",
    vignette:
      "linear-gradient(180deg, rgba(2,6,23,0.4) 0%, rgba(2,6,23,0.1) 40%, rgba(2,6,23,0.45) 100%)",
  },
};

export default function ThemeBackground({ timeOfDay }) {
  const videoRef = useRef(null);

  const config = THEME_CONFIG[timeOfDay] || THEME_CONFIG.day;
  const activeVideoSrc = config.video;
  const activePosterSrc = config.poster;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Cinematic smooth playback speed
    video.playbackRate = 0.55;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Handled silently for autoplay policies
      }
    };

    playVideo();

    return () => {
      video.pause();
    };
  }, [activeVideoSrc]);

  // Atmospheric sun bloom overlay layer
  const sunBloomLayer = useMemo(
    () => (
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: config.sunGlow,
          mixBlendMode: "screen",
        }}
        aria-hidden="true"
      />
    ),
    [config.sunGlow],
  );

  // Cinematic edge vignette, backdrop blur & contrast overlay layer
  const vignetteLayer = useMemo(
    () => (
      <div
        className="pointer-events-none absolute inset-0 backdrop-blur-[6px] bg-black/10 transition-all duration-1000 ease-out"
        style={{
          background: config.vignette,
        }}
        aria-hidden="true"
      />
    ),
    [config.vignette],
  );

  return (
    <div
      className={`fixed inset-0 overflow-hidden ${config.skyGradient} transition-colors duration-1000 ease-in-out`}
      aria-hidden="true"
    >
      {/* Background Video with calibrated focal framing */}
      <video
        ref={videoRef}
        key={activeVideoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={`${import.meta.env.BASE_URL}${activePosterSrc}`}
        style={{
          objectPosition: config.objectPosition,
        }}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
      >
        <source
          src={`${import.meta.env.BASE_URL}${activeVideoSrc}`}
          type="video/mp4"
        />
      </video>

      {/* Atmospheric Volumetric Sun Bloom */}
      {sunBloomLayer}

      {/* Depth Vignette & Readability Filter */}
      {vignetteLayer}
    </div>
  );
}
