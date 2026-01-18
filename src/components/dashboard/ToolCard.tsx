import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
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
    <motion.div 
      className="card-feature group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cn("icon-box mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300", iconColorClass)}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">{description}</p>
      <motion.button 
        onClick={onButtonClick}
        className="btn-outline w-full text-xs sm:text-sm font-semibold"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {buttonLabel}
      </motion.button>
    </motion.div>
  );
};

export default ToolCard;
