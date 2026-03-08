import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import OnboardingLayout from "@/layouts/OnboardingLayout";
import ComparisonSlider from "@/components/onboarding/ComparisonSlider";
import ContinueButton from "@/components/onboarding/ContinueButton";
import StepIndicator from "@/components/onboarding/StepIndicator";
import portraitBefore from "@/assets/portrait-before.jpg";
import portraitAfter from "@/assets/portrait-after.jpg";

const Onboarding1 = () => {
  const navigate = useNavigate();

  return (
    <OnboardingLayout currentStep={1}>
      <motion.div 
        className="text-center mb-4 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">
          Restore & Compare
        </h1>
        <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base">
          Edit, Enhance, and Compare pictures in high definition with our AI restoration engine.
        </p>
      </motion.div>

      <ComparisonSlider 
        beforeImage={portraitBefore}
        afterImage={portraitAfter}
      />

      <StepIndicator currentStep={1} totalSteps={3} />

      <motion.div 
        className="mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ContinueButton onClick={() => navigate('/onboarding/2')} />
      </motion.div>
    </OnboardingLayout>
  );
};

export default Onboarding1;
