import { useState } from "react";

export default function ThemeDebugger({ onTimeChange }) {
  const [selectedTime, setSelectedTime] = useState("auto");
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: "auto", label: "تلقائي", time: "حسب الوقت الفعلي" },
    { value: "sunrise", label: "شروق", time: "5:00 - 8:00" },
    { value: "day", label: "نهار", time: "8:00 - 17:00" },
    { value: "sunset", label: "غروب", time: "17:00 - 20:00" },
    { value: "night", label: "ليل", time: "20:00 - 5:00" },
  ];

  const handleChange = (value) => {
    setSelectedTime(value);
    onTimeChange(value);
    setIsOpen(false); // Close menu after selection on mobile/tablet
  };

  return (
    <>
      {/* Mobile & Tablet: Top-right floating button */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black/50 backdrop-blur-md rounded-full p-3 border border-white/20 text-white shadow-lg"
          aria-label="اختبار الثيمات"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>

        {/* Mobile/Tablet dropdown menu */}
        {isOpen && (
          <div className="absolute top-16 right-0 bg-black/50 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[240px] shadow-2xl">
            <h3 className="text-white text-sm font-bold mb-3">اختبار الثيمات</h3>
            <div className="flex flex-col gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleChange(theme.value)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === theme.value
                      ? "bg-sky-500 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  <div className="flex justify-between items-center gap-3">
                    <span>{theme.label}</span>
                    <span className="text-xs opacity-60">{theme.time}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Top-right panel (always visible) */}
      <div className="hidden lg:block fixed top-4 right-4 z-50 bg-black/50 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
        <h3 className="text-white text-sm font-bold mb-3">اختبار الثيمات</h3>
        <div className="flex flex-col gap-2">
          {themes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => handleChange(theme.value)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedTime === theme.value
                  ? "bg-sky-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <div className="flex justify-between items-center gap-3">
                <span>{theme.label}</span>
                <span className="text-xs opacity-60">{theme.time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
