import { Link } from "react-router-dom";
import { Linkedin, Instagram, Twitter } from "lucide-react";

const OnboardingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-3 flex-shrink-0 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <img src="/SE_circlelogo.png" alt="SnapExx" className="w-5 h-5 object-contain" />
          <span className="text-[11px] text-white/40">
            © {currentYear} SnapExx AI
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <a 
              href="https://www.linkedin.com/company/nextera-build/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-cyan-400/20 text-white/50 hover:text-cyan-400 transition-all duration-300"
            >
              <Linkedin className="w-3 h-3" />
            </a>
            <a 
              href="https://www.instagram.com/nextera.build" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-cyan-400/20 text-white/50 hover:text-cyan-400 transition-all duration-300"
            >
              <Instagram className="w-3 h-3" />
            </a>
            <a 
              href="https://x.com/build_nextera" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-cyan-400/20 text-white/50 hover:text-cyan-400 transition-all duration-300"
            >
              <Twitter className="w-3 h-3" />
            </a>
          </div>
          
          <div className="flex gap-4 text-[11px] text-white/40">
            <Link to="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-white/70 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default OnboardingFooter;
