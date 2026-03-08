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
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 max-w-5xl mx-auto px-4">
        {/* Left - Image Comparison */}
        <motion.div 
          className="relative w-full max-w-sm lg:max-w-none"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative flex rounded-2xl overflow-hidden shadow-elevated">
            {/* Original Side */}
            <div className="relative w-1/2 sm:w-44 lg:w-52">
              <img 
                src={portraitCasual} 
                alt="Original" 
                className="w-full h-52 sm:h-64 lg:h-72 object-cover"
              />
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white/90 text-xs font-semibold rounded-lg">
                  ORIGINAL
                </span>
              </div>
            </div>

            {/* Divider with handle */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-full shadow-lg flex items-center justify-center">
                <ChevronsLeftRight className="w-4 h-4 text-white/70" />
              </div>
            </div>

            {/* AI Pro Side */}
            <div className="relative w-1/2 sm:w-44 lg:w-52">
              <img 
                src={portraitProfessional} 
                alt="AI Pro" 
                className="w-full h-52 sm:h-64 lg:h-72 object-cover"
              />
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
                <span className="px-2.5 py-1 bg-cyan-400 text-black text-xs font-semibold rounded-lg">
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 text-white">
            Professional AI
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 text-white">
            Portraits <span className="text-cyan-400">for</span>
          </h2>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 mb-3 sm:mb-4">
            your career.
          </h2>

          <p className="text-white/50 mb-4 sm:mb-5 max-w-md mx-auto lg:mx-0 text-sm sm:text-base">
            Transform casual snapshots into high-end studio headshots instantly. 
            Perfect for LinkedIn, CVs, and professional portfolios.
          </p>

          <div className="flex justify-center lg:justify-start gap-4 sm:gap-8 mb-4 sm:mb-5">
            <FeatureBadge label="Studio Lighting" />
            <FeatureBadge label="HD Texture" />
          </div>

          <StepIndicator currentStep={2} totalSteps={3} />

          <div className="mt-4 sm:mt-5 flex justify-center lg:justify-start">
            <ContinueButton onClick={() => navigate('/onboarding/3')} />
          </div>
        </motion.div>
      </div>
    </OnboardingLayout>
  );
};

export default Onboarding2;
