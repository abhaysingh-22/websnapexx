import { Check } from "lucide-react";

interface FeatureBadgeProps {
  label: string;
}

const FeatureBadge = ({ label }: FeatureBadgeProps) => {
  return (
    <div className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base">
      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-cyan-400 flex items-center justify-center flex-shrink-0">
        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
      </div>
      <span className="text-white/80">{label}</span>
    </div>
  );
};

export default FeatureBadge;
