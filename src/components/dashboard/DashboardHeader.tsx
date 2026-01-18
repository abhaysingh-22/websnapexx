import { Moon, Sun, User, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { Home, Clock, Diamond, HelpCircle, ArrowUp } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const pageTitles: Record<string, string> = {
  "/home": "HOME",
  "/history": "HISTORY",
  "/premium": "PREMIUM",
  "/profile": "PROFILE",
  "/faqs": "HELP CENTER",
  "/chat": "CHAT",
};

const navItems = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/history", label: "History", icon: Clock },
  { path: "/premium", label: "Premium", icon: Diamond, badge: "PRO" },
  { path: "/profile", label: "Profile", icon: User },
];

const DashboardHeader = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = pageTitles[location.pathname] || "DASHBOARD";

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Logo size="md" showSubtitle />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-accent/10 text-accent" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="badge-pro">{item.badge}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 space-y-4 border-t border-border">
        {/* Plan Card */}
        <div className="bg-secondary rounded-xl p-4">
          <p className="text-xs font-semibold text-accent mb-1">CURRENT PLAN</p>
          <p className="font-semibold mb-3">Free Trial</p>
          <div className="w-full bg-border rounded-full h-1.5 mb-2">
            <div className="bg-accent h-1.5 rounded-full" style={{ width: '67%' }} />
          </div>
          <p className="text-xs text-muted-foreground">670/1000 credits remaining</p>
        </div>

        {/* Upgrade Button */}
        <Link 
          to="/premium" 
          onClick={() => setMobileOpen(false)}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <ArrowUp className="w-4 h-4" />
          Upgrade to Pro
        </Link>

        {/* Help */}
        <Link 
          to="/faqs"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          Help Center
        </Link>
      </div>
    </>
  );

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-card">
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
        
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
