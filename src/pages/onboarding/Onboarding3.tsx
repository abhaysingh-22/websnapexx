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
      <div className="w-full max-w-3xl mx-auto">
        {/* Product Image */}
        <motion.div 
          className="relative rounded-2xl overflow-hidden shadow-elevated mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={watchProduct} 
            alt="Luxury Watch" 
            className="w-full h-72 md:h-96 object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1.5 bg-card/90 backdrop-blur-sm text-xs font-semibold rounded-lg flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3" />
              4K
            </span>
            <span className="px-3 py-1.5 bg-card/90 backdrop-blur-sm text-xs font-semibold rounded-lg flex items-center gap-1.5">
              <File className="w-3 h-3" />
              AD READY
            </span>
          </div>

          {/* AI Engine Badge */}
          <div className="absolute bottom-4 right-4">
            <span className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg">
              SNAPEXX AI ENGINE
            </span>
          </div>
        </motion.div>

        {/* Title and Description */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Create anything
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-accent mb-4">
            from prompts.
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Instant Ad & Video generation for professionals and creators.
          </p>
        </motion.div>

        {/* Prompt Box */}
        <motion.div 
          className="bg-card rounded-2xl border border-border p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1">PROMPT</p>
              <p className="text-sm">
                A cinematic studio shot of a luxury watch with leather strap, minimalist lighting...
              </p>
            </div>
            <button className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Tool Buttons */}
        <motion.div 
          className="flex justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {tools.map((tool) => (
            <button 
              key={tool.label}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border hover:bg-secondary transition-colors"
            >
              <tool.icon className="w-4 h-4" />
              <span className="text-sm">{tool.label}</span>
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
