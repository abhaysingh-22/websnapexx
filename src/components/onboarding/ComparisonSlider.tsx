import { useState, useRef } from "react";
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
    <div 
      ref={containerRef}
      className="relative w-full max-w-[240px] sm:max-w-[300px] md:max-w-[360px] lg:max-w-[400px] aspect-square rounded-xl overflow-hidden shadow-elevated cursor-ew-resize"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
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

      <div className="absolute top-2 left-2">
        <span className="px-2.5 py-1 bg-cyan-400 text-black text-[11px] font-semibold rounded">
          {afterLabel}
        </span>
      </div>

      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-cyan-400"
        style={{ left: `${sliderPosition}%` }}
      />

      {/* Slider Handle */}
      <div 
        className="comparison-slider-thumb z-10"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <ChevronsLeftRight className="w-3 h-3 text-black" />
      </div>

      {/* Slide to Reveal Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white/80">
          <Hand className="w-3 h-3" />
          SLIDE TO REVEAL
        </div>
      </div>
    </div>
  );
};
export default ComparisonSlider;
