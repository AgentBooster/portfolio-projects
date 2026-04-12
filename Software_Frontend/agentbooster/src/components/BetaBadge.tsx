import { Sparkles } from "lucide-react";

const BetaBadge = () => {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 pointer-events-none">
      <div className="beta-badge-glow relative flex items-center gap-1.5 px-3 py-1 md:px-3.5 md:py-1.5 rounded-full text-white font-semibold text-xs md:text-sm shadow-lg">
        <Sparkles className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
        <span>BETA</span>
      </div>
    </div>
  );
};

export default BetaBadge;
