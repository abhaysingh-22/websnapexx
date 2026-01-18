import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light";
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

const Logo = ({ variant = "default", size = "md", showSubtitle = false }: LogoProps) => {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-lg" },
    md: { icon: "w-10 h-10", text: "text-xl" },
    lg: { icon: "w-12 h-12", text: "text-2xl" },
  };

  const colors = {
    default: {
      icon: "bg-primary text-primary-foreground",
      text: "text-foreground",
      subtitle: "text-muted-foreground",
    },
    light: {
      icon: "bg-accent text-accent-foreground",
      text: "text-primary-foreground",
      subtitle: "text-primary-foreground/70",
    },
  };

  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "rounded-full flex items-center justify-center font-bold",
        sizes[size].icon,
        colors[variant].icon
      )}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </div>
      <div>
        <h1 className={cn("font-bold", sizes[size].text, colors[variant].text)}>
          SnapExx{showSubtitle ? " AI" : ""}
        </h1>
        {showSubtitle && (
          <p className={cn("text-xs", colors[variant].subtitle)}>
            NextEra Professional
          </p>
        )}
      </div>
    </div>
  );
};

export default Logo;
