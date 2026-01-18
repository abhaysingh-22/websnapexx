import { Moon, Sun, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

const pageTitles: Record<string, string> = {
  "/home": "HOME",
  "/history": "HISTORY",
  "/premium": "PREMIUM",
  "/profile": "PROFILE",
  "/faqs": "HELP CENTER",
  "/chat": "CHAT",
};

const DashboardHeader = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const pageTitle = pageTitles[location.pathname] || "DASHBOARD";

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground">
          {pageTitle}
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        <div className="flex items-center gap-2 md:gap-3 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">Alex Rivera</p>
            <p className="text-xs text-muted-foreground">Creative Director</p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center ring-2 ring-accent">
            <User className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
