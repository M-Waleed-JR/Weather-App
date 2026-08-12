import { FaSearch } from "react-icons/fa";
import { useState } from "react";

const SearchBar = ({ onSearch, isDay }) => {
  const [city, setCity] = useState("");

  const styles = isDay
    ? {
        field: "border-slate-900/20 bg-white/40 focus-within:ring-slate-900/10",
        input: "text-slate-900 placeholder-slate-900/50",
        icon: "text-slate-900/80",
      }
    : {
        field: "border-white/30 bg-white/15 focus-within:ring-white/20",
        input: "text-white placeholder-white/60",
        icon: "text-white/90",
      };

  function handelSubmit(e) {
    e.preventDefault();
    if (!city.trim()) return;
    if (onSearch) {
      onSearch(city.trim());
    }
  }

  return (
    <div className="mb-4 w-full max-w-sm">
      <form
        onSubmit={handelSubmit}
        className={`relative flex h-11 items-center overflow-hidden rounded-full border backdrop-blur-sm focus-within:ring-2 ${styles.field}`}
      >
        <input
          type="search"
          dir="rtl"
          placeholder="ابحث عن مدينة..."
          aria-label="البحث عن مدينة"
          className={`h-full w-full min-w-0 bg-transparent pl-4 pr-12 text-base outline-none [&::-webkit-search-cancel-button]:appearance-none ${styles.input}`}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <FaSearch
          className={`pointer-events-none absolute right-3.75 top-1/2 -translate-y-1/2 text-sm ${styles.icon}`}
        />
      </form>
    </div>
  );
};

export default SearchBar;
