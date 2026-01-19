import { Check } from "lucide-react";

interface FeatureBadgeProps {
  label: string;
}

const FeatureBadge = ({ label }: FeatureBadgeProps) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-accent flex items-center justify-center flex-shrink-0">
        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent" />
      </div>
      <span className="text-foreground">{label}</span>
    </div>
  );
};

export default FeatureBadge;
