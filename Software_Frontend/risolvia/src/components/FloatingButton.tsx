
import { MessageSquare } from "lucide-react";

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-1 md:px-1 lg:px-3 py-8 rounded-r-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex flex-col items-center justify-center group transform hover:scale-105"
      style={{ minHeight: '120px' }}
    >
      <MessageSquare className="w-3 md:w-3 lg:w-4 h-3 md:h-3 lg:h-4 mb-1 group-hover:animate-bounce flex-shrink-0" />
      <span 
        className="text-xs md:text-xs lg:text-sm leading-tight"
        style={{ 
          writingMode: 'vertical-rl', 
          textOrientation: 'mixed', 
          transform: 'rotate(180deg)',
          whiteSpace: 'nowrap'
        }}
      >
        Solicitar cotización
      </span>
    </button>
  );
};

export default FloatingButton;
