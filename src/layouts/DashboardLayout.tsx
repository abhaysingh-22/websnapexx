import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Clock, Crown, User, HelpCircle, Menu, Moon, Sun, LogOut, Trash2, MessageSquarePlus, Mail, Loader2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Footer from "@/components/ui/Footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { externalSupabase } from "@/integrations/externalSupabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
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
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // Get user's full name from metadata (set during registration)
  const displayName = user?.user_metadata?.full_name || 'User';

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast.error(error.message || "Failed to sign out");
      } else {
        toast.success("Signed out successfully");
      }
    } finally {
      setIsSigningOut(false);
      navigate("/signin");
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
    setDeleteConfirmText("");
    setDeleteError(false);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmText.trim().toLowerCase() !== "confirm") {
      setDeleteError(true);
      return;
    }

    setIsDeletingAccount(true);
    try {
      const { data: sessionData } = await externalSupabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be signed in to delete your account.");
        return;
      }

      const invokeDelete = async () =>
        externalSupabase.functions.invoke("delete-account", {
          body: {},
        });

      let { error: deleteError } = await invokeDelete();

      if (deleteError?.message?.toLowerCase().includes("invalid or expired token")) {
        const { error: refreshError } = await externalSupabase.auth.refreshSession();
        if (refreshError) {
          toast.error("Your session is no longer valid. Please sign in again and retry.");
          return;
        }
        ({ error: deleteError } = await invokeDelete());
      }

      if (deleteError) {
        const msg = deleteError.message || "Delete failed";
        console.error("Delete account error:", deleteError);
        
        if (msg.toLowerCase().includes("failed to fetch") || msg.toLowerCase().includes("networkerror")) {
          toast.error("Edge Function not reachable. Please deploy the delete-account function.");
        } else if (msg.toLowerCase().includes("function not found")) {
          toast.error("The delete-account Edge Function is not deployed.");
        } else if (msg.toLowerCase().includes("invalid or expired token")) {
          toast.error("Your session is invalid. Please sign out, sign in again, and retry.");
        } else {
          toast.error(msg);
        }
        return;
      }

      localStorage.removeItem("app_conversations");
      localStorage.removeItem("app_messages");
      localStorage.removeItem("auth-storage");

      await signOut();
      setShowDeleteDialog(false);
      toast.success("Account deleted successfully.");
      navigate("/register");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleDeleteKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirmDelete();
    }
  };

  const handleContactUs = () => {
    window.location.href = "mailto:nextera.inbox@gmail.com";
  };

  const handleFeedback = () => {
    navigate("/profile");
  };

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
                <span className="hidden lg:inline">Help</span>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium">{displayName}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center ring-2 ring-accent">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border border-border z-50">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuItem 
                    onClick={handleFeedback}
                    className="cursor-pointer"
                  >
                    <MessageSquarePlus className="w-4 h-4 mr-2" />
                    Feedback
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleContactUs}
                    className="cursor-pointer"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className="cursor-pointer"
                  >
                    {isSigningOut ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDeleteAccount}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Account Permanently
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This action cannot be undone. All your data, projects, and settings will be permanently deleted.
              </p>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Type <span className="font-bold text-destructive">confirm</span> to delete your account:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => {
                    setDeleteConfirmText(e.target.value);
                    setDeleteError(false);
                  }}
                  onKeyDown={handleDeleteKeyPress}
                  placeholder="Type 'confirm' here"
                  className={cn(
                    "input-field w-full",
                    deleteError && "border-destructive focus:ring-destructive"
                  )}
                  autoFocus
                />
                {deleteError && (
                  <p className="text-destructive text-xs mt-1">Please type "confirm" exactly to proceed.</p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border font-semibold text-sm hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeletingAccount}
              className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm hover:bg-destructive/90 transition-colors"
            >
              {isDeletingAccount ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardLayout;
