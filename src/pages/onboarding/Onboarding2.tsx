import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import OnboardingLayout from "@/layouts/OnboardingLayout";
import ContinueButton from "@/components/onboarding/ContinueButton";
import StepIndicator from "@/components/onboarding/StepIndicator";
import FeatureBadge from "@/components/onboarding/FeatureBadge";
import { ChevronsLeftRight } from "lucide-react";
import portraitCasual from "@/assets/portrait-casual.jpg";
import portraitProfessional from "@/assets/portrait-professional.jpg";

const Onboarding2 = () => {
  const navigate = useNavigate();

  return (
    <OnboardingLayout currentStep={2}>
      <div className="flex flex-col lg:flex-row items-center gap-12 max-w-5xl mx-auto">
        {/* Left - Image Comparison */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative flex rounded-2xl overflow-hidden shadow-elevated">
            {/* Original Side */}
            <div className="relative w-48">
              <img 
                src={portraitCasual} 
                alt="Original" 
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1.5 bg-card/90 backdrop-blur-sm text-xs font-semibold rounded-lg">
                  ORIGINAL
                </span>
              </div>
            </div>

            {/* Divider with handle */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-8 h-8 bg-card rounded-full shadow-lg flex items-center justify-center">
                <ChevronsLeftRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* AI Pro Side */}
            <div className="relative w-48">
              <img 
                src={portraitProfessional} 
                alt="AI Pro" 
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-4 right-4">
                <span className="px-3 py-1.5 bg-accent text-accent-foreground text-xs font-semibold rounded-lg">
                  AI PRO
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right - Content */}
        <motion.div 
          className="flex-1 text-left"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Professional AI
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            Portraits <span className="text-accent">for</span>
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-accent mb-6">
            your career.
          </h2>

          <p className="text-muted-foreground mb-8 max-w-md">
            Transform casual snapshots into high-end studio headshots instantly. 
            Perfect for LinkedIn, CVs, and professional portfolios.
          </p>

          <div className="flex gap-8 mb-8">
            <FeatureBadge label="Studio Lighting" />
            <FeatureBadge label="HD Texture" />
          </div>

          <StepIndicator currentStep={2} totalSteps={3} />

          <div className="mt-8">
            <ContinueButton onClick={() => navigate('/onboarding/3')} />
          </div>
        </motion.div>
      </div>
    </OnboardingLayout>
  );
};

export default Onboarding2;
