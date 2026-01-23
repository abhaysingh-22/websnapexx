import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, CircleDot, Wand2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import OnboardingFooter from "@/components/ui/OnboardingFooter";
import { cn } from "@/lib/utils";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps?: number;
}

const steps = [
  { id: 1, label: "Restore & Compare", icon: Sparkles, path: "/onboarding/1" },
  { id: 2, label: "AI Portraits", icon: CircleDot, path: "/onboarding/2" },
  { id: 3, label: "Prompt Engineering", icon: Wand2, path: "/onboarding/3" },
];

const OnboardingLayout = ({ 
  children, 
  currentStep, 
  totalSteps = 3 
}: OnboardingLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="h-14 md:h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Logo size="md" />
              
              {/* Vertical Separator */}
              <div className="hidden md:block h-8 w-px bg-border" />
              
              {/* Progress Label */}
              <p className="hidden md:block text-xs font-medium tracking-widest text-muted-foreground">
                ONBOARDING
              </p>
            </div>

            {/* Desktop Navigation - Step Indicators */}
            <nav className="hidden md:flex items-center gap-1">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => navigate(step.path)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-accent/10 text-accent" 
                        : isCompleted
                          ? "text-foreground hover:bg-secondary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Step Indicator */}
            <div className="md:hidden flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Step</span>
              <span className="text-sm font-semibold text-accent">{currentStep}/{totalSteps}</span>
            </div>

            {/* Skip Link */}
            <Link 
              to="/register"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip
            </Link>
          </div>
        </div>
        
        {/* Mobile Step Progress Bar */}
        <div className="md:hidden h-1 bg-border">
          <div 
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 md:py-4 overflow-hidden">
        {children}
      </main>

      {/* Compact Footer */}
      <OnboardingFooter />
    </div>
  );
};

export default OnboardingLayout;