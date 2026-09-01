import { useState, useCallback } from "react";
import { useToast } from "../context/ToastContext.jsx";
import { LocationIcon, SearchIcon } from "./Icons";

const SearchBar = ({ onSearch, timeOfDay }) => {
  const [city, setCity] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const { error: showToastError, info: showToastInfo } = useToast();

  const isLight = timeOfDay === "day" || timeOfDay === "sunrise";

  const styles = isLight
    ? {
        field:
          "bg-white/50 border-slate-200/60 focus-within:border-sky-400 focus-within:bg-white/70 focus-within:ring-sky-400/20",
        input: "text-slate-800 placeholder-slate-400",
        icon: "text-slate-400 group-focus-within:text-sky-500",
        locationBtn: "text-slate-400 hover:text-sky-500",
      }
    : {
        field:
          "bg-white/10 border-white/20 focus-within:border-sky-400/50 focus-within:bg-white/15 focus-within:ring-sky-400/20",
        input: "text-white placeholder-white/40",
        icon: "text-white/40 group-focus-within:text-sky-400",
        locationBtn: "text-white/40 hover:text-sky-400",
      };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmed = city.trim();
      if (!trimmed) return;
      onSearch(trimmed);
    },
    [city, onSearch],
  );

  const handleCityChange = useCallback((e) => {
    setCity(e.target.value);
  }, []);

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      showToastError("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    showToastInfo("جاري تحديد موقعك...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSearch(`${latitude},${longitude}`);
        setIsDetecting(false);
      },
      (error) => {
        let message = "Unable to retrieve your location";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location permission was denied. Please search manually.";
        } else if (error.code === error.TIMEOUT) {
          message = "Location request timed out. Please try again.";
        }
        showToastError(message);
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [onSearch, showToastError, showToastInfo]);

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative group">
        <div
          className={`flex items-center h-14 w-full rounded-2xl border-2 backdrop-blur-md transition-all duration-300 focus-within:ring-4 ${styles.field}`}
        >
          <button
            type="button"
            onClick={handleGeolocation}
            disabled={isDetecting}
            className={`absolute left-10 p-2.5 rounded-xl transition-all duration-200 ${styles.locationBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={
              isDetecting ? "جاري تحديد الموقع..." : "استخدام موقعي الحالي"
            }
            title={
              isDetecting ? "جاري تحديد الموقع..." : "استخدام موقعي الحالي"
            }
          >
            <LocationIcon
              className={`w-5 h-5 ${isDetecting ? "animate-spin" : ""}`}
            />
          </button>
          <input
            type="search"
            placeholder="ابحث عن مدينة..."
            aria-label="البحث عن مدينة"
            className={`h-full w-full bg-transparent pr-6 pl-14 text-base outline-none ${styles.input}`}
            value={city}
            onChange={handleCityChange}
            disabled={isDetecting}
          />
          <button
            type="submit"
            className={`absolute left-3 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 ${styles.icon}`}
            aria-label="بحث"
            disabled={isDetecting}
          >
            <SearchIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
