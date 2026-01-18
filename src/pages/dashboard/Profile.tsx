import { motion } from "framer-motion";
import { MessageSquarePlus, Frown, Meh, Smile, Send } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Profile = () => {
  const [rating, setRating] = useState<number | null>(null);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Account Management */}
        <div className="card-elevated p-6">
          <h2 className="text-xl font-bold mb-2">Account Management</h2>
          <p className="text-muted-foreground mb-6">
            Manage your public presence and account credentials.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input 
                type="text"
                defaultValue="NextEra Admin"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input 
                type="email"
                defaultValue="nextera.admin@snapexx.ai"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="card-elevated p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="icon-box-blue">
              <MessageSquarePlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Feedback</h2>
              <p className="text-muted-foreground">
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
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className={cn(
                    "w-10 h-10 rounded-full border flex items-center justify-center transition-colors",
                    rating === value 
                      ? "border-accent text-accent bg-accent/10" 
                      : "border-border text-muted-foreground hover:border-accent/50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            <button className="btn-outline flex items-center gap-2">
              Send Feedback
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Logout Account */}
        <div className="card-elevated p-6 border-l-4 border-l-warning">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-warning">Logout Account</h2>
              <p className="text-muted-foreground">
                This will logout your current account, no data will be deleted.
              </p>
            </div>
            <button className="px-6 py-3 rounded-xl bg-accent/10 text-accent font-medium hover:bg-accent/20 transition-colors">
              Click here
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="card-elevated p-6 border-l-4 border-l-destructive">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-destructive">Delete Account</h2>
              <p className="text-muted-foreground max-w-lg">
                Permanently remove your workspace and all generated assets. This action is 
                irreversible and will immediately terminate your active subscription.
              </p>
            </div>
            <button className="px-6 py-3 rounded-xl border border-destructive text-destructive font-medium hover:bg-destructive/10 transition-colors">
              Deactivate Account
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground py-6">
          © 2024 SnapExx AI. All rights reserved. Professional Node ID: NEX-ERA-PROD-01
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Profile;
