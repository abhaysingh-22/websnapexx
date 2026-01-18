import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronsLeftRight, Hand } from "lucide-react";

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const ComparisonSlider = ({ 
  beforeImage, 
  afterImage, 
  beforeLabel = "BEFORE",
  afterLabel = "AFTER" 
}: ComparisonSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-elevated cursor-ew-resize"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* After Image (Full) */}
      <img 
        src={afterImage} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Before Image (Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={beforeImage} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* After Label */}
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1.5 bg-accent text-accent-foreground text-xs font-semibold rounded-lg">
          {afterLabel}
        </span>
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-accent"
        style={{ left: `${sliderPosition}%` }}
      />

      {/* Slider Handle */}
      <div 
        className="comparison-slider-thumb z-10"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <ChevronsLeftRight className="w-4 h-4 text-accent-foreground" />
      </div>

      {/* Slide to Reveal Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 px-4 py-2 bg-card/90 backdrop-blur-sm rounded-full text-sm">
          <Hand className="w-4 h-4" />
          SLIDE TO REVEAL
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonSlider;
