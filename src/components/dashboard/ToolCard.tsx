import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  icon: LucideIcon;
  iconColorClass: string;
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick?: () => void;
}

const ToolCard = ({ 
  icon: Icon, 
  iconColorClass, 
  title, 
  description, 
  buttonLabel,
  onButtonClick 
}: ToolCardProps) => {
  return (
    <div className="card-feature group">
      <div className={cn("icon-box mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300", iconColorClass)}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">{description}</p>
      <button 
        onClick={onButtonClick}
        className="btn-outline w-full text-xs sm:text-sm font-semibold"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default ToolCard;
