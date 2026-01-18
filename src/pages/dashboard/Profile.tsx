import { motion } from "framer-motion";
import { MessageSquarePlus, Frown, Meh, Smile, Send } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Profile = () => {
  const [rating, setRating] = useState<number | null>(null);

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Account Management */}
        <motion.div variants={itemVariants} className="card-elevated p-6">
          <h2 className="text-xl font-bold mb-2">Account Management</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Manage your public presence and account credentials.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Display Name</label>
              <input 
                type="text"
                defaultValue="NextEra Admin"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input 
                type="email"
                defaultValue="nextera.admin@snapexx.ai"
                className="input-field"
              />
            </div>
          </div>
        </motion.div>

        {/* Feedback */}
        <motion.div variants={itemVariants} className="card-elevated p-6">
          <div className="flex items-start gap-4 mb-4">
            <motion.div 
              className="icon-box-blue"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquarePlus className="w-6 h-6" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold">Feedback</h2>
              <p className="text-muted-foreground leading-relaxed">
                How can we improve your AI generation experience?
              </p>
            </div>
          </div>

          <textarea 
            placeholder="Type your suggestions here..."
            className="input-field min-h-[120px] resize-y mb-4"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[
                { icon: Frown, value: 1 },
                { icon: Meh, value: 2 },
                { icon: Smile, value: 3 },
              ].map(({ icon: Icon, value }) => (
                <motion.button
                  key={value}
                  onClick={() => setRating(value)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300",
                    rating === value 
                      ? "border-accent text-accent bg-accent/10" 
                      : "border-border text-muted-foreground hover:border-accent/50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </motion.button>
              ))}
            </div>

            <motion.button 
              className="btn-outline flex items-center gap-2 font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Feedback
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Logout Account */}
        <motion.div 
          variants={itemVariants}
          className="card-elevated p-6 border-l-4 border-l-warning"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-warning">Logout Account</h2>
              <p className="text-muted-foreground leading-relaxed">
                This will logout your current account, no data will be deleted.
              </p>
            </div>
            <motion.button 
              className="px-6 py-3 rounded-xl bg-accent/10 text-accent font-bold hover:bg-accent/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Click here
            </motion.button>
          </div>
        </motion.div>

        {/* Delete Account */}
        <motion.div 
          variants={itemVariants}
          className="card-elevated p-6 border-l-4 border-l-destructive"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-destructive">Delete Account</h2>
              <p className="text-muted-foreground max-w-lg leading-relaxed">
                Permanently remove your workspace and all generated assets. This action is 
                irreversible and will immediately terminate your active subscription.
              </p>
            </div>
            <motion.button 
              className="px-6 py-3 rounded-xl border border-destructive text-destructive font-bold hover:bg-destructive/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Deactivate Account
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          className="text-center text-xs text-muted-foreground py-6 font-medium"
        >
          © 2024 SnapExx AI. All rights reserved. Professional Node ID: NEX-ERA-PROD-01
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Profile;
