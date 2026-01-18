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
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Restore & Compare
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Edit, Enhance, and Compare pictures in high definition with our 
          state-of-the-art AI restoration engine.
        </p>
      </motion.div>

      <ComparisonSlider 
        beforeImage={portraitBefore}
        afterImage={portraitAfter}
      />

      <StepIndicator currentStep={1} totalSteps={3} />

      <motion.div 
        className="mt-8"
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
