import { FaSearch } from "react-icons/fa";
import { useState } from "react";

const SearchBar = ({ onSearch, timeOfDay }) => {
  const [city, setCity] = useState("");

  const isLight = timeOfDay === "day" || timeOfDay === "sunrise";

  const styles = isLight
    ? {
        field:
          "bg-white/50 border-slate-200/60 focus-within:border-sky-400 focus-within:bg-white/70 focus-within:ring-sky-400/20",
        input: "text-slate-800 placeholder-slate-400",
        icon: "text-slate-400 group-focus-within:text-sky-500",
      }
    : {
        field:
          "bg-white/10 border-white/20 focus-within:border-sky-400/50 focus-within:bg-white/15 focus-within:ring-sky-400/20",
        input: "text-white placeholder-white/40",
        icon: "text-white/40 group-focus-within:text-sky-400",
      };

  function handleSubmit(e) {
    e.preventDefault();
    if (!city.trim()) return;
    if (onSearch) {
      onSearch(city.trim());
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative group">
        <div
          className={`flex items-center h-14 w-full rounded-2xl border-2 backdrop-blur-md transition-all duration-300 focus-within:ring-4 ${styles.field}`}
        >
          <input
            type="search"
            placeholder="ابحث عن مدينة..."
            aria-label="البحث عن مدينة"
            className={`h-full w-full bg-transparent pr-6 pl-14 text-base outline-none ${styles.input}`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            type="submit"
            className={`absolute left-3 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 ${styles.icon}`}
            aria-label="بحث"
          >
            <FaSearch className="text-base" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
