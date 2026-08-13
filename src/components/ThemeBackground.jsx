import { useRef, useEffect } from "react";

export default function ThemeBackground({ timeOfDay }) {
  const sunriseVideoRef = useRef(null);
  const dayVideoRef = useRef(null);
  const sunsetVideoRef = useRef(null);
  const nightVideoRef = useRef(null);

  useEffect(() => {
    // Set playback rates - slow motion for all videos
    if (sunriseVideoRef.current) sunriseVideoRef.current.playbackRate = 0.5;
    if (dayVideoRef.current) dayVideoRef.current.playbackRate = 0.5;
    if (sunsetVideoRef.current) sunsetVideoRef.current.playbackRate = 0.5;
    if (nightVideoRef.current) nightVideoRef.current.playbackRate = 0.5; // Slow motion

    // Ensure videos loop continuously and never stop
    const videos = [sunriseVideoRef, dayVideoRef, sunsetVideoRef, nightVideoRef];

    videos.forEach(ref => {
      if (ref.current) {
        const video = ref.current;

        // Force play and loop
        video.play().catch(err => console.log('Video play error:', err));

        // Re-play if video ends (backup to loop attribute)
        const handleEnded = () => {
          video.currentTime = 0;
          video.play().catch(err => console.log('Video replay error:', err));
        };

        video.addEventListener('ended', handleEnded);

        // Cleanup
        return () => {
          video.removeEventListener('ended', handleEnded);
        };
      }
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* SUNRISE VIDEO */}
      <video
        ref={sunriseVideoRef}
        key="sunrise-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ objectPosition: 'top right' }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
          timeOfDay === "sunrise" ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="Themes/sunrise.mp4" type="video/mp4" />
      </video>

      {/* DAY VIDEO */}
      <video
        ref={dayVideoRef}
        key="day-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ objectPosition: 'top right' }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
          timeOfDay === "day" ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="Themes/Day.mp4" type="video/mp4" />
      </video>

      {/* SUNSET VIDEO */}
      <video
        ref={sunsetVideoRef}
        key="sunset-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ objectPosition: 'top right' }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
          timeOfDay === "sunset" ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="Themes/sunshine.mp4" type="video/mp4" />
      </video>

      {/* NIGHT VIDEO */}
      <video
        ref={nightVideoRef}
        key="night-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ objectPosition: 'top right' }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
          timeOfDay === "night" ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="Themes/Night.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
