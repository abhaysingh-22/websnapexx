import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light";
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  iconOnly?: boolean;
}

const Logo = ({ variant = "default", size = "md", showSubtitle = false, iconOnly = false }: LogoProps) => {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-lg", img: "w-8 h-8" },
    md: { icon: "w-10 h-10", text: "text-xl", img: "w-10 h-10" },
    lg: { icon: "w-12 h-12", text: "text-2xl", img: "w-12 h-12" },
  };

  const colors = {
    default: {
      text: "text-foreground",
      subtitle: "text-muted-foreground",
    },
    light: {
      text: "text-primary-foreground",
      subtitle: "text-primary-foreground/70",
    },
  };

  return (
    <div className="flex items-center gap-3">
      {/* Replace SVG with your official logo */}
      <img 
        src="/SE_circlelogo.png" 
        alt="SnapExx Logo" 
        className={cn("object-contain", sizes[size].img)}
      />
      {!iconOnly && (
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
      )}
    </div>
  );
};

export default Logo;
