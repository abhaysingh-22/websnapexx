import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface FeaturedCardProps {
  image: string;
  badge?: string;
  tag: string;
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick?: () => void;
}

const FeaturedCard = ({ 
  image, 
  badge,
  tag, 
  title, 
  description, 
  buttonLabel,
  onButtonClick 
}: FeaturedCardProps) => {
  return (
    <motion.div 
      className="card-feature overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative rounded-xl overflow-hidden mb-3 sm:mb-4">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-40 sm:h-48 lg:h-56 object-cover transition-transform duration-500 hover:scale-105" 
        />
        {badge && (
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
            <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs font-semibold rounded-lg">
              {badge}
            </span>
          </div>
        )}
      </div>
      <span className="text-xs font-bold tracking-widest text-accent mb-1 sm:mb-2 block uppercase">
        {tag}
      </span>
      <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">{description}</p>
      <motion.button 
        onClick={onButtonClick}
        className="btn-primary inline-flex items-center gap-2 text-xs sm:text-sm group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {buttonLabel}
        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </motion.div>
  );
};

export default FeaturedCard;
