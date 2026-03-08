import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, CircleDot, Wand2 } from "lucide-react";
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
    <div className="h-screen bg-[#0b1120] flex flex-col overflow-hidden">
      {/* Decorative background patterns */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="onboardingCircleGrid" x="0" y="0" width="34" height="34" patternUnits="userSpaceOnUse">
            <circle cx="17" cy="17" r="6.5" fill="none" stroke="rgba(0,255,220,0.12)" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect x="0" y="6%" width="28%" height="38%" rx="20" fill="url(#onboardingCircleGrid)" />
        <rect x="66%" y="56%" width="26%" height="32%" rx="20" fill="url(#onboardingCircleGrid)" />

        <path d="M -20 150 Q 140 40 200 350 Q 260 680 60 880" fill="none" stroke="rgba(0,255,220,0.18)" strokeWidth="1.5" />
        <path d="M 980 -20 Q 1120 160 1340 100" fill="none" stroke="rgba(0,255,220,0.18)" strokeWidth="1.5" />
        <path d="M 1060 360 Q 1220 510 1400 680" fill="none" stroke="rgba(0,255,220,0.18)" strokeWidth="1.5" />
        <path d="M 380 880 Q 620 790 920 960" fill="none" stroke="rgba(0,255,220,0.14)" strokeWidth="1.2" />
      </svg>

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-white/[0.06] flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="h-12 md:h-14 flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="inline-flex items-center gap-2 group">
                <img src="/SE_circlelogo.png" alt="SnapExx" className="w-7 h-7 object-contain" />
                <span className="font-bold text-sm text-white/90 group-hover:text-white transition-colors">SnapExx</span>
              </Link>
              
              <div className="hidden md:block h-6 w-px bg-white/[0.08]" />
              
              <p className="hidden md:block text-[10px] font-medium tracking-widest text-white/30 uppercase">
                Onboarding
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
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                      isActive 
                        ? "bg-cyan-400/10 text-cyan-400" 
                        : isCompleted
                          ? "text-white/70 hover:bg-white/[0.04]"
                          : "text-white/30 hover:bg-white/[0.04] hover:text-white/50"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Step Indicator */}
            <div className="md:hidden flex items-center gap-1.5">
              <span className="text-xs text-white/40">Step</span>
              <span className="text-xs font-semibold text-cyan-400">{currentStep}/{totalSteps}</span>
            </div>

            {/* Skip Link */}
            <Link 
              to="/register"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Skip
            </Link>
          </div>
        </div>
        
        {/* Mobile Step Progress Bar */}
        <div className="md:hidden h-0.5 bg-white/[0.06]">
          <div 
            className="h-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2 md:py-3 overflow-hidden">
        {children}
      </main>

      {/* Compact Footer */}
      <div className="relative z-10">
        <OnboardingFooter />
      </div>
    </div>
  );
};

export default OnboardingLayout;