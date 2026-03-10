import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Trash2, MessageSquarePlus, Mail, Loader2, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
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

interface UserAvatarDropdownProps {
  displayName: string;
  email?: string;
}

const UserAvatarDropdown = ({ displayName, email }: UserAvatarDropdownProps) => {
  const navigate = useNavigate();
  const { signOut, isAuthenticated } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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
    navigate("/faqs", { state: { scrollToContact: true } });
  };

  const handleFeedback = () => {
    navigate("/profile");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-medium truncate max-w-[120px]">{displayName}</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center ring-2 ring-accent">
              <User className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card border border-border z-[100]">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-sm font-medium">{isAuthenticated ? displayName : 'Guest User'}</p>
            <p className="text-xs text-muted-foreground truncate">{isAuthenticated ? email : 'Not signed in'}</p>
          </div>
          {isAuthenticated ? (
            <>
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
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem 
                onClick={() => navigate("/signin")}
                className="cursor-pointer"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate("/register")}
                className="cursor-pointer"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Account Permanently
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
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
                  />
                  {deleteError && (
                    <p className="text-destructive text-xs mt-1">Please type "confirm" exactly to proceed.</p>
                  )}
                </div>
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
    </>
  );
};

export default UserAvatarDropdown;
