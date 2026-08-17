import { useState } from "react";

export default function ThemeDebugger({ onTimeChange, themes, currentTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (value) => {
    onTimeChange(value);
    setIsOpen(false);
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
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>

        {/* Mobile/Tablet dropdown menu */}
        {isOpen && (
          <div className="absolute top-16 right-0 bg-black/50 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[240px] shadow-2xl">
            <h3 className="text-white text-sm font-bold mb-3">
              اختبار الثيمات
            </h3>
            <div className="flex flex-col gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleChange(theme.value)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                    currentTheme === theme.value
                      ? "bg-sky-500 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  <span className="text-xl">{theme.icon}</span>
                  <span className="flex-1 text-right">{theme.label}</span>
                  {currentTheme === theme.value && (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
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
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                currentTheme === theme.value
                  ? "bg-sky-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <span className="text-xl">{theme.icon}</span>
              <span className="flex-1 text-right">{theme.label}</span>
              {currentTheme === theme.value && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
