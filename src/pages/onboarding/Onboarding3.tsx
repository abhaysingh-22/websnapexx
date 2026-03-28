import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/layouts/OnboardingLayout";
import ContinueButton from "@/components/onboarding/ContinueButton";
import { Video, Sparkles, FileText, ImageIcon, File } from "lucide-react";
import watchProduct from "@/assets/watch-product.jpg";

const Onboarding3 = () => {
  const navigate = useNavigate();

  const tools = [
    { icon: Video, label: "Video Gen" },
    { icon: Sparkles, label: "Auto-Enhance" },
    { icon: FileText, label: "Ad Copy" },
  ];

  return (
    <OnboardingLayout currentStep={3}>
      <div className="w-full max-w-3xl mx-auto px-4">
        {/* Product Image */}
        <div 
          className="relative rounded-xl overflow-hidden shadow-elevated mb-4"
                                         >
          <img 
            src={watchProduct} 
            alt="Luxury Watch" 
            className="w-full h-36 sm:h-48 md:h-60 object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white/90 text-xs font-semibold rounded flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              4K
            </span>
            <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white/90 text-xs font-semibold rounded flex items-center gap-1">
              <File className="w-3 h-3" />
              AD READY
            </span>
          </div>

          {/* AI Engine Badge */}
          <div className="absolute bottom-2 right-2">
            <span className="px-2.5 py-1 bg-cyan-400 text-black text-xs font-semibold rounded">
              SNAPEXX AI ENGINE
            </span>
          </div>
        </div>

        {/* Title and Description */}
        <div 
          className="text-center mb-4"
                                         >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 text-white">
            Create anything
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
            from prompts.
          </h2>
          <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base">
            Instant Ad & Video generation for professionals and creators.
          </p>
        </div>

        {/* Prompt Box */}
        <div 
          className="bg-white/[0.04] rounded-lg border border-white/[0.08] p-3 sm:p-4 mb-4"
                                         >
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] sm:text-xs font-medium text-white/40 mb-1">PROMPT</p>
              <p className="text-sm text-white/80 line-clamp-1">
                A cinematic studio shot of a luxury watch with leather strap...
              </p>
            </div>
            <button className="w-9 h-9 rounded-lg bg-cyan-400 text-black flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tool Buttons */}
        <div 
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4"
                                         >
          {tools.map((tool) => (
            <button 
              key={tool.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.1] text-white/60 hover:bg-white/[0.06] hover:text-white/80 transition-colors"
            >
              <tool.icon className="w-3.5 h-3.5" />
              <span className="text-xs sm:text-sm">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Get Started Button */}
        <div 
          className="flex justify-center"
                                         >
          <ContinueButton 
            onClick={() => navigate('/app/home')} 
            label="Get Started"
          />
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default Onboarding3;
