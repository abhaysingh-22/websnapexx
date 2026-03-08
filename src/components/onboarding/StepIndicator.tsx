import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-5 sm:mt-7">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={cn(
            "h-1.5 sm:h-2 rounded-full transition-all duration-300",
            step === currentStep 
              ? "w-8 sm:w-10 bg-cyan-400" 
              : "w-2 sm:w-2.5 bg-white/[0.12]"
          )}
        />
      ))}
    </div>
  );
};

export default StepIndicator;
