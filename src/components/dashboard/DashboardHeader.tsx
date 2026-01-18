import { Bell, Moon } from "lucide-react";
import userAvatar from "@/assets/user-avatar.jpg";

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
      <div>
        <p className="text-xs font-semibold tracking-widest text-muted-foreground">
          DASHBOARD OVERVIEW
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>
        
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Moon className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-3 ml-2">
          <div className="text-right">
            <p className="text-sm font-medium">Alex Rivera</p>
            <p className="text-xs text-muted-foreground">Creative Director</p>
          </div>
          <img 
            src={userAvatar} 
            alt="Alex Rivera" 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-accent"
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
