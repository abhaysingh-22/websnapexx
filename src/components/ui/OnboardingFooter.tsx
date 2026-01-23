import { Link } from "react-router-dom";
import { Linkedin, Instagram, Twitter } from "lucide-react";
import Logo from "@/components/ui/Logo";

const OnboardingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-3 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-xs text-muted-foreground">
            © {currentYear} SnapExx AI
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <a 
              href="https://www.linkedin.com/company/nextera-build/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://www.instagram.com/nextera.build" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://x.com/build_nextera" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
          </div>
          
          <div className="hidden sm:flex gap-4 text-xs text-muted-foreground">
            <button className="hover:text-foreground transition-colors">Terms</button>
            <button className="hover:text-foreground transition-colors">Privacy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default OnboardingFooter;
