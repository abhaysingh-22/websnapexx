import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { Sparkles, CircleDot, Wand2 } from "lucide-react";

interface OnboardingSidebarProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: "Restore & Compare", icon: Sparkles },
  { id: 2, label: "AI Portraits", icon: CircleDot },
  { id: 3, label: "Prompt Engineering", icon: Wand2 },
];

const OnboardingSidebar = ({ currentStep }: OnboardingSidebarProps) => {
  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen bg-gradient-to-b from-secondary to-card border-r border-border p-8">
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
            <div
              key={step.id}
              className={cn(
                "progress-step",
                isActive ? "progress-step-active" : "progress-step-inactive"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Help Section at bottom */}
      <div className="mt-auto">
        <div className="p-4 bg-card rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">Need help with setup?</p>
        </div>
      </div>
    </aside>
  );
};

export default OnboardingSidebar;
