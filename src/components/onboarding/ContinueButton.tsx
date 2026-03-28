import { ArrowRight } from "lucide-react";

interface ContinueButtonProps {
  onClick: () => void;
  label?: string;
}

const ContinueButton = ({ onClick, label = "Continue" }: ContinueButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 min-w-[180px] sm:min-w-[220px] text-sm sm:text-base px-5 sm:px-7 py-2.5 sm:py-3 bg-cyan-400 text-black font-semibold rounded-lg hover:bg-cyan-300 transition-colors"
                  >
      {label}
      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );
};

export default ContinueButton;
