import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { Sparkles, CircleDot, Wand2, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface OnboardingSidebarProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: "Restore & Compare", icon: Sparkles, path: "/onboarding/1" },
  { id: 2, label: "AI Portraits", icon: CircleDot, path: "/onboarding/2" },
  { id: 3, label: "Prompt Engineering", icon: Wand2, path: "/onboarding/3" },
];

const OnboardingSidebar = ({ currentStep }: OnboardingSidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleStepClick = (step: typeof steps[0]) => {
    navigate(step.path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-sm"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-secondary to-card border-r border-border p-8 z-50 transition-transform duration-300",
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-medium tracking-widest text-muted-foreground mb-2">
            NEXTERA PRESENT
          </p>
          <Logo size="md" />
        </div>

        {/* Progress Steps */}
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-widest text-muted-foreground mb-4">
            ONBOARDING PROGRESS
          </p>
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;
            
            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step)}
                className={cn(
                  "progress-step w-full text-left cursor-pointer transition-all hover:opacity-80",
                  isActive ? "progress-step-active" : "progress-step-inactive"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Terms Section at bottom */}
        <div className="mt-auto absolute bottom-8 left-8 right-8">
          <div className="p-4 bg-card rounded-xl border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">LEGAL</p>
            <div className="space-y-1">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Terms of Service
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Privacy Policy
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default OnboardingSidebar;
