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
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 max-w-4xl mx-auto px-4">
        {/* Left - Image Comparison */}
        <motion.div 
          className="relative w-full max-w-sm lg:max-w-none"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative flex rounded-2xl overflow-hidden shadow-elevated">
            {/* Original Side */}
            <div className="relative w-1/2 sm:w-36 lg:w-40">
              <img 
                src={portraitCasual} 
                alt="Original" 
                className="w-full h-44 sm:h-52 lg:h-60 object-cover"
              />
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                <span className="px-2 py-1 bg-card/90 backdrop-blur-sm text-[10px] font-semibold rounded-lg">
                  ORIGINAL
                </span>
              </div>
            </div>

            {/* Divider with handle */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-6 h-6 bg-card rounded-full shadow-lg flex items-center justify-center">
                <ChevronsLeftRight className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>

            {/* AI Pro Side */}
            <div className="relative w-1/2 sm:w-36 lg:w-40">
              <img 
                src={portraitProfessional} 
                alt="AI Pro" 
                className="w-full h-44 sm:h-52 lg:h-60 object-cover"
              />
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
                <span className="px-2 py-1 bg-accent text-accent-foreground text-[10px] font-semibold rounded-lg">
                  AI PRO
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right - Content */}
        <motion.div 
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5">
            Professional AI
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5">
            Portraits <span className="text-accent">for</span>
          </h2>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-accent mb-2 sm:mb-3">
            your career.
          </h2>

          <p className="text-muted-foreground mb-3 sm:mb-4 max-w-md mx-auto lg:mx-0 text-xs sm:text-sm">
            Transform casual snapshots into high-end studio headshots instantly. 
            Perfect for LinkedIn, CVs, and professional portfolios.
          </p>

          <div className="flex justify-center lg:justify-start gap-3 sm:gap-6 mb-3 sm:mb-4">
            <FeatureBadge label="Studio Lighting" />
            <FeatureBadge label="HD Texture" />
          </div>

          <StepIndicator currentStep={2} totalSteps={3} />

          <div className="mt-3 sm:mt-4 flex justify-center lg:justify-start">
            <ContinueButton onClick={() => navigate('/onboarding/3')} />
          </div>
        </motion.div>
      </div>
    </OnboardingLayout>
  );
};

export default Onboarding2;
