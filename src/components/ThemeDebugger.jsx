import { useState, useRef, useEffect } from "react";
import { CheckIcon, ChevronDownIcon } from "./Icons";

export default function ThemeDebugger({ onTimeChange, themes, currentTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2.5 border border-white/20 text-white text-sm font-medium flex items-center gap-2 shadow-lg hover:bg-black/50 transition-colors"
        aria-label="Theme selector"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{themes.find(t => t.value === currentTheme)?.icon || "🌅"}</span>
        <span className="hidden sm:inline">{themes.find(t => t.value === currentTheme)?.label || "Auto"}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-2 min-w-40 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          {themes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => {
                onTimeChange(theme.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${
                currentTheme === theme.value
                  ? "bg-sky-500/20 text-sky-300"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              <span className="text-base">{theme.icon}</span>
              <span>{theme.label}</span>
              {currentTheme === theme.value && <CheckIcon className="ml-auto w-4 h-4 text-sky-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}