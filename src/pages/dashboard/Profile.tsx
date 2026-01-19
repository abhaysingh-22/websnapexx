import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, Frown, Meh, Smile, Send, User, Mail, Settings, LogOut, Trash2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import TypewriterPlaceholder from "@/components/ui/TypewriterPlaceholder";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

// Simulated user data - in real app this would come from auth context
const userData = {
  name: "NextEra Admin",
  email: "nextera.admin@snapexx.ai",
  role: "Creative Director",
  memberSince: "Oct 2023"
};

const Profile = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState(false);

  const handleLogout = () => {
    navigate('/signin');
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
    setDeleteConfirmText("");
    setDeleteError(false);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmText.toLowerCase() === "confirm") {
      navigate('/register');
    } else {
      setDeleteError(true);
    }
  };

  const handleDeleteKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirmDelete();
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-4 sm:space-y-6"
      >
        {/* Profile Header Card */}
        <motion.div variants={itemVariants} className="card-elevated p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center ring-4 ring-accent/20">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-accent-foreground" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-xl sm:text-2xl font-bold">{userData.name}</h1>
              <p className="text-muted-foreground text-sm sm:text-base">{userData.role}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="badge-pro">PRO MEMBER</span>
                <span className="text-xs text-muted-foreground">Since {userData.memberSince}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Management */}
        <motion.div variants={itemVariants} className="card-elevated p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="icon-box-blue">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Account Management</h2>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Your account credentials
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Display Name
              </label>
              <div className="input-field text-sm sm:text-base bg-muted/50 cursor-not-allowed">
                {userData.name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email Address
              </label>
              <div className="input-field text-sm sm:text-base bg-muted/50 cursor-not-allowed">
                {userData.email}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feedback */}
        <motion.div variants={itemVariants} className="card-elevated p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <motion.div 
              className="icon-box-purple"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquarePlus className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Feedback</h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                How can we improve your AI generation experience?
              </p>
            </div>
          </div>

          <TypewriterPlaceholder
            placeholder="Type your suggestions here..."
            value={feedback}
            onChange={setFeedback}
            className="input-field min-h-[80px] sm:min-h-[100px] md:min-h-[120px] resize-y mb-3 sm:mb-4 text-sm sm:text-base w-full"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground mr-1 sm:mr-2">Rate:</span>
              {[
                { icon: Frown, value: 1, label: "Bad" },
                { icon: Meh, value: 2, label: "Okay" },
                { icon: Smile, value: 3, label: "Great" },
              ].map(({ icon: Icon, value, label }) => (
                <motion.button
                  key={value}
                  onClick={() => setRating(value)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-300",
                    rating === value 
                      ? "border-accent text-accent bg-accent/10" 
                      : "border-border text-muted-foreground hover:border-accent/50"
                  )}
                  title={label}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              ))}
            </div>

            <motion.button 
              className="btn-primary flex items-center gap-2 text-sm font-bold w-full sm:w-auto justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Feedback
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Account Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Logout Account */}
          <motion.div 
            variants={itemVariants}
            className="card-elevated p-4 sm:p-6 border-l-4 border-l-warning"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start gap-3 mb-3">
              <LogOut className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-warning">Logout Account</h2>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  Logout from your current session safely.
                </p>
              </div>
            </div>
            <motion.button 
              onClick={handleLogout}
              className="w-full px-4 py-2.5 rounded-xl bg-warning/10 text-warning font-bold text-sm hover:bg-warning/20 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Logout
            </motion.button>
          </motion.div>

          {/* Delete Account */}
          <motion.div 
            variants={itemVariants}
            className="card-elevated p-4 sm:p-6 border-l-4 border-l-destructive"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start gap-3 mb-3">
              <Trash2 className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-destructive">Delete Account</h2>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  Permanently remove your account and all data.
                </p>
              </div>
            </div>
            <motion.button 
              onClick={handleDeleteAccount}
              className="w-full px-4 py-2.5 rounded-xl border border-destructive text-destructive font-bold text-sm hover:bg-destructive/10 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Delete Account
            </motion.button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          className="text-center text-xs text-muted-foreground py-4 sm:py-6 font-medium"
        >
          © 2024 SnapExx AI. All rights reserved.
        </motion.div>
      </motion.div>

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
              className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm hover:bg-destructive/90 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Profile;
