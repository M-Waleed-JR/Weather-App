import { CheckCircleIcon } from "./Icons";

function getThemeClasses(timeOfDay) {
  const isLight = timeOfDay === "day" || timeOfDay === "sunrise";

  return isLight
    ? {
        card: "bg-white/30 border-white/40",
        cardInner: "bg-white/40",
        heading: "text-slate-800",
        muted: "text-slate-600",
        faint: "text-slate-500",
        accent: "text-amber-500",
        adviceBg: "bg-amber-50/50",
        iconColor: "text-amber-500",
      }
    : {
        card: "bg-slate-900/40 border-white/10",
        cardInner: "bg-slate-800/40",
        heading: "text-white",
        muted: "text-slate-300",
        faint: "text-slate-400",
        accent: "text-sky-400",
        adviceBg: "bg-sky-50/10",
        iconColor: "text-sky-400",
      };
}

export default function AdviceSection({ advice, timeOfDay }) {
  if (!advice) return null;

  const theme = getThemeClasses(timeOfDay);
  const { card, heading, muted, adviceBg, iconColor } = theme;

  return (
    <div className="w-full max-w-2xl">
      <div
        className={`w-full rounded-3xl ${card} backdrop-blur-xl border shadow-2xl overflow-hidden`}
      >
        {/* Advice Header */}
        <div className={`px-6 py-4 border-b ${theme.cardInner}`}>
          <h3 className={`text-lg font-bold ${heading}`}>نصائح الطقس</h3>
        </div>

        {/* Advice Content */}
        <div className={`p-6 ${adviceBg} mx-4 my-4 rounded-xl`}>
          <div className="flex items-start gap-4">
            <div className={`shrink-0 mt-0.5 ${iconColor}`}>
              <CheckCircleIcon />
            </div>
            <div className="flex-1">
              <p className={`text-sm leading-relaxed ${muted}`}>{advice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
