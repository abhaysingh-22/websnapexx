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
    <div className="card-feature">
      <div className={cn("icon-box mb-4", iconColorClass)}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <button 
        onClick={onButtonClick}
        className="btn-outline w-full text-sm"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default ToolCard;
