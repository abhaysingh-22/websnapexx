import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Clock, Diamond, User, HelpCircle, ArrowUp, Menu, PanelLeftClose, PanelLeft } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/ui/Logo";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Footer from "@/components/ui/Footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/history", label: "History", icon: Clock },
  { path: "/premium", label: "Premium", icon: Diamond, badge: "PRO" },
  { path: "/profile", label: "Profile", icon: User },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const SidebarContent = ({ isCollapsed = false, showCollapseButton = false, onToggleCollapse }: { isCollapsed?: boolean; showCollapseButton?: boolean; onToggleCollapse?: () => void }) => (
    <>
      {/* Logo */}
      <div
        className={cn(
          "h-[72px] px-6 border-b border-border flex items-center",
          isCollapsed ? "justify-center px-4" : "justify-between"
        )}
      >
        <Logo size="md" showSubtitle={!isCollapsed} iconOnly={isCollapsed} />
      </div>

      {/* Navigation */}
      <nav className="p-4">
        {/* Collapse Toggle Button - Above Navigation */}
        {showCollapseButton && (
          <div className={cn("mb-2", isCollapsed ? "flex justify-center" : "flex justify-end")}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onToggleCollapse}
                >
                  {isCollapsed ? (
                    <PanelLeft className="w-4 h-4" />
                  ) : (
                    <PanelLeftClose className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            const linkContent = (
              <Link
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isCollapsed && "justify-center px-2",
                  isActive 
                    ? "bg-accent/10 text-accent" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="badge-pro">{item.badge}</span>
                    )}
                  </>
                )}
              </Link>
            );

            return (
              <li key={item.path}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {linkContent}
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  linkContent
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Pro Tip Section - fills the gap */}
      {!isCollapsed && (
        <div className="flex-1 px-4 py-6 flex flex-col justify-end">
          <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-4 border border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-xs">💡</span>
              </div>
              <p className="text-xs font-semibold text-accent">PRO TIP</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use AI-powered enhancements to transform your photos into stunning professional portraits in seconds.
            </p>
          </div>
        </div>
      )}
      {isCollapsed && <div className="flex-1" />}

      {/* Bottom Section */}
      <div className={cn("p-4 space-y-4 border-t border-border", isCollapsed && "p-2")}>
        {/* Plan Card - Hide when collapsed */}
        {!isCollapsed && (
          <div className="bg-secondary rounded-xl p-4">
            <p className="text-xs font-semibold text-accent mb-1">CURRENT PLAN</p>
            <p className="font-semibold mb-3">Free Trial</p>
            <div className="w-full bg-border rounded-full h-1.5 mb-2">
              <div className="bg-accent h-1.5 rounded-full" style={{ width: '67%' }} />
            </div>
            <p className="text-xs text-muted-foreground">670/1000 credits remaining</p>
          </div>
        )}

        {/* Upgrade Button */}
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                to="/premium" 
                onClick={() => setMobileOpen(false)}
                className="w-full btn-primary flex items-center justify-center p-2"
              >
                <ArrowUp className="w-4 h-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Upgrade to Pro</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Link 
            to="/premium" 
            onClick={() => setMobileOpen(false)}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <ArrowUp className="w-4 h-4" />
            Upgrade to Pro
          </Link>
        )}

        {/* Help */}
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                to="/faqs"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center p-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Help Center</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Link 
            to="/faqs"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            Help Center
          </Link>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Mobile Header with Menu Toggle */}
      <header className="md:hidden sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <Logo size="sm" />
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-card">
            <div className="flex flex-col h-full">
              <SidebarContent isCollapsed={false} />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Sidebar + Main Content Row */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside 
          className={cn(
            "hidden md:flex flex-col bg-card border-r border-border shrink-0 transition-all duration-300",
            collapsed ? "w-16" : "w-64"
          )}
        >
          <SidebarContent isCollapsed={collapsed} showCollapseButton onToggleCollapse={() => setCollapsed(!collapsed)} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="hidden md:block">
            <DashboardHeader />
          </div>
          <div className="flex-1 p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Full-Width Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
