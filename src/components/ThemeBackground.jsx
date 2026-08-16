import { useRef, useEffect, useMemo } from "react";

const THEME_VIDEOS = {
  sunrise: "Themes/sunrise.mp4",
  day: "Themes/Day.mp4",
  sunset: "Themes/sunset.mp4",
  night: "Themes/Night.mp4",
};

export default function ThemeBackground({ timeOfDay }) {
  const videoRef = useRef(null);

  // Use relative paths that Vite/browsers can resolve based on the current location
  const activeVideoSrc = THEME_VIDEOS[timeOfDay] || THEME_VIDEOS.day;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Slow down playback
    video.playbackRate = 0.5;

    // Ensure it plays
    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Autoplay policy might block it, we catch but don't log to avoid noise
      }
    };

    playVideo();

    // Cleanup: Just pause, don't clear src which can cause "no source" errors
    return () => {
      video.pause();
    };
  }, [activeVideoSrc]);

  // Render overlay for all videos - improves text readability on video backgrounds
  const videoOverlay = useMemo(
    () => (
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/5 transition-opacity duration-1000 ease-in-out"
        aria-hidden="true"
      />
    ),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <video
        ref={videoRef}
        key={activeVideoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ objectPosition: "top right" }}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
      >
        {/* Using a relative path that starts from the base of the app */}
        <source
          src={`${import.meta.env.BASE_URL}${activeVideoSrc}`}
          type="video/mp4"
        />
      </video>
      {videoOverlay}
    </div>
  );
}
