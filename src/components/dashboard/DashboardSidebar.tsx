import { Link, useLocation } from "react-router-dom";
import { Home, Clock, Diamond, User, HelpCircle, ArrowUp, Menu } from "lucide-react";
import Logo from "@/components/ui/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/history", label: "History", icon: Clock },
  { path: "/premium", label: "Premium", icon: Diamond, badge: "PRO" },
  { path: "/profile", label: "Profile", icon: User },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar>
      {/* Logo */}
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <Logo size="md" showSubtitle />
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        to={item.path}
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
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom Section */}
      <SidebarFooter className="p-4 space-y-4">
        {/* Plan Card */}
        {/* <div className="bg-secondary rounded-xl p-4">
          <p className="text-xs font-semibold text-accent mb-1">CURRENT PLAN</p>
          <p className="font-semibold mb-3">Free Trial</p>
          <div className="w-full bg-border rounded-full h-1.5 mb-2">
            <div className="bg-accent h-1.5 rounded-full" style={{ width: '67%' }} />
          </div>
          <p className="text-xs text-muted-foreground">670/1000 credits remaining</p>
        </div> */}

        {/* Upgrade Button */}
        {/* <Link to="/premium" className="w-full btn-primary flex items-center justify-center gap-2">
          <ArrowUp className="w-4 h-4" />
          Upgrade to Pro
        </Link> */}

        {/* Help */}
        <Link 
          to="/faqs" 
          className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          Help Center
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
