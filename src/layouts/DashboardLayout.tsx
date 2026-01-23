import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Clock, Crown, User, HelpCircle, Menu, Moon, Sun } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Footer from "@/components/ui/Footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/useAuth";
import UserAvatarDropdown from "@/components/dashboard/UserAvatarDropdown";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/history", label: "History", icon: Clock },
  { path: "/premium", label: "Premium", icon: Crown },
  { path: "/profile", label: "Profile", icon: User },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  // Get user's full name from metadata (set during registration)
  const displayName = user?.user_metadata?.full_name || 'User';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="h-16 md:h-[72px] flex items-center justify-between gap-4">
            {/* Logo */}
            <Logo size="md" />
            
            {/* Vertical Separator */}
            <div className="hidden md:block h-8 w-px bg-border mx-2" />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-accent/10 text-accent" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Help Link - Desktop */}
              <Link 
                to="/faqs"
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden lg:inline">FAQs</span>
              </Link>

              {/* Theme Toggle */}
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

              {/* User Avatar with Dropdown */}
              <UserAvatarDropdown displayName={displayName} email={user?.email} />

              {/* Mobile Menu Toggle */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 w-72 bg-card">
                  <div className="flex flex-col h-full">
                    {/* Mobile Logo */}
                    <div className="h-16 px-6 border-b border-border flex items-center">
                      <Logo size="md" />
                    </div>

                    {/* Mobile Navigation */}
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
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>

                    {/* Mobile Bottom Section */}
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
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
