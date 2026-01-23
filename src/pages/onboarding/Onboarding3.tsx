import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
      <div className="w-full max-w-2xl mx-auto px-4">
        {/* Product Image */}
        <motion.div 
          className="relative rounded-xl overflow-hidden shadow-elevated mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={watchProduct} 
            alt="Luxury Watch" 
            className="w-full h-28 sm:h-36 md:h-44 object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            <span className="px-1.5 py-0.5 bg-card/90 backdrop-blur-sm text-[9px] font-semibold rounded flex items-center gap-0.5">
              <ImageIcon className="w-2.5 h-2.5" />
              4K
            </span>
            <span className="px-1.5 py-0.5 bg-card/90 backdrop-blur-sm text-[9px] font-semibold rounded flex items-center gap-0.5">
              <File className="w-2.5 h-2.5" />
              AD READY
            </span>
          </div>

          {/* AI Engine Badge */}
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-1 bg-primary text-primary-foreground text-[9px] font-semibold rounded">
              SNAPEXX AI ENGINE
            </span>
          </div>
        </motion.div>

        {/* Title and Description */}
        <motion.div 
          className="text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-0.5">
            Create anything
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-accent mb-1">
            from prompts.
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-[11px] sm:text-xs">
            Instant Ad & Video generation for professionals and creators.
          </p>
        </motion.div>

        {/* Prompt Box */}
        <motion.div 
          className="bg-card rounded-lg border border-border p-2 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-medium text-muted-foreground mb-0.5">PROMPT</p>
              <p className="text-[11px] line-clamp-1">
                A cinematic studio shot of a luxury watch with leather strap...
              </p>
            </div>
            <button className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Tool Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-1.5 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {tools.map((tool) => (
            <button 
              key={tool.label}
              className="flex items-center gap-1 px-2 py-1 rounded-full border border-border hover:bg-secondary transition-colors"
            >
              <tool.icon className="w-3 h-3" />
              <span className="text-[11px]">{tool.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Get Started Button */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ContinueButton 
            onClick={() => navigate('/register')} 
            label="Get Started"
          />
        </motion.div>
      </div>
    </OnboardingLayout>
  );
};

export default Onboarding3;
