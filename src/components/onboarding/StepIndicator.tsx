import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={cn(
            "h-1 sm:h-1.5 rounded-full transition-all duration-300",
            step === currentStep 
              ? "w-6 sm:w-8 bg-primary" 
              : "w-1.5 sm:w-2 bg-border"
          )}
        />
      ))}
    </div>
  );
};

export default StepIndicator;
