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
      <div className="w-full max-w-3xl mx-auto px-4">
        {/* Product Image */}
        <motion.div 
          className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-elevated mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={watchProduct} 
            alt="Luxury Watch" 
            className="w-full h-36 sm:h-48 md:h-56 lg:h-72 object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex gap-2">
            <span className="px-2 py-1 bg-card/90 backdrop-blur-sm text-[10px] sm:text-xs font-semibold rounded-lg flex items-center gap-1">
              <ImageIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              4K
            </span>
            <span className="px-2 py-1 bg-card/90 backdrop-blur-sm text-[10px] sm:text-xs font-semibold rounded-lg flex items-center gap-1">
              <File className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              AD READY
            </span>
          </div>

          {/* AI Engine Badge */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
            <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-primary text-primary-foreground text-[10px] sm:text-xs font-semibold rounded-lg">
              SNAPEXX AI ENGINE
            </span>
          </div>
        </motion.div>

        {/* Title and Description */}
        <motion.div 
          className="text-center mb-4 sm:mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1">
            Create anything
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-accent mb-2 sm:mb-3">
            from prompts.
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-xs sm:text-sm">
            Instant Ad & Video generation for professionals and creators.
          </p>
        </motion.div>

        {/* Prompt Box */}
        <motion.div 
          className="bg-card rounded-xl border border-border p-3 mb-3 sm:mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1">PROMPT</p>
              <p className="text-xs sm:text-sm line-clamp-2">
                A cinematic studio shot of a luxury watch with leather strap, minimalist lighting...
              </p>
            </div>
            <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </motion.div>

        {/* Tool Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-4 sm:mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {tools.map((tool) => (
            <button 
              key={tool.label}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full border border-border hover:bg-secondary transition-colors"
            >
              <tool.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-xs sm:text-sm">{tool.label}</span>
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
