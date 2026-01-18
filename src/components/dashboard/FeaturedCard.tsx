import { ArrowRight } from "lucide-react";

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
    <div className="card-feature">
      <div className="relative rounded-xl overflow-hidden mb-4">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        {badge && (
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1.5 bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs font-semibold rounded-lg">
              {badge}
            </span>
          </div>
        )}
      </div>
      <span className="text-xs font-semibold tracking-widest text-accent mb-2 block">
        {tag}
      </span>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <button 
        onClick={onButtonClick}
        className="btn-primary inline-flex items-center gap-2 text-sm"
      >
        {buttonLabel}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FeaturedCard;
