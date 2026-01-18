import { Check } from "lucide-react";

interface FeatureBadgeProps {
  label: string;
}

const FeatureBadge = ({ label }: FeatureBadgeProps) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center">
        <Check className="w-3 h-3 text-accent" />
      </div>
      <span className="text-foreground">{label}</span>
    </div>
  );
};

export default FeatureBadge;
