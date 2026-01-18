import { ReactNode } from "react";
import OnboardingSidebar from "@/components/onboarding/OnboardingSidebar";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps?: number;
}

const OnboardingLayout = ({ 
  children, 
  currentStep, 
  totalSteps = 3 
}: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      <OnboardingSidebar currentStep={currentStep} />
      <main className="flex-1 lg:ml-0 flex flex-col">
        <OnboardingHeader currentStep={currentStep} totalSteps={totalSteps} />
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
