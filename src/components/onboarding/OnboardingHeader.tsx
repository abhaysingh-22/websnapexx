import { ChevronLeft, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onSkip?: () => void;
}

const OnboardingHeader = ({ 
  currentStep, 
  totalSteps, 
  onBack,
  onSkip 
}: OnboardingHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentStep > 1) {
      navigate(`/onboarding/${currentStep - 1}`);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      navigate('/app/home');
    }
  };

  return (
    <header className="flex items-center justify-between py-4 px-6">
      <div className="flex items-center gap-4">
        {currentStep > 1 && (
          <button 
            onClick={handleBack}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
        <span className="text-sm text-muted-foreground">
          STEP {currentStep} OF {totalSteps}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
          <Moon className="w-5 h-5 text-muted-foreground" />
        </button>
        <button 
          onClick={handleSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>
    </header>
  );
};

export default OnboardingHeader;
