import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="relative h-dvh bg-slate-50 dark:bg-[#0b1120] text-foreground overflow-hidden flex flex-col">
      {/* Decorative background patterns */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        {/* Circle grid patterns */}
        <defs>
          <pattern id="circleGrid" x="0" y="0" width="34" height="34" patternUnits="userSpaceOnUse">
            <circle cx="17" cy="17" r="6.5" fill="none" stroke="currentColor" className="text-cyan-600/30 dark:text-cyan-400/15" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect x="0" y="6%" width="28%" height="38%" rx="20" fill="url(#circleGrid)" />
        <rect x="66%" y="56%" width="26%" height="32%" rx="20" fill="url(#circleGrid)" />

        {/* Flowing accent curves */}
        <path d="M -20 150 Q 140 40 200 350 Q 260 680 60 880" fill="none" stroke="currentColor" className="text-cyan-600/40 dark:text-cyan-400/20" strokeWidth="2" />
        <path d="M 980 -20 Q 1120 160 1340 100" fill="none" stroke="currentColor" className="text-cyan-600/40 dark:text-cyan-400/20" strokeWidth="2" />
        <path d="M 1060 360 Q 1220 510 1400 680" fill="none" stroke="currentColor" className="text-cyan-600/40 dark:text-cyan-400/20" strokeWidth="2" />
        <path d="M 380 880 Q 620 790 920 960" fill="none" stroke="currentColor" className="text-cyan-600/30 dark:text-cyan-400/15" strokeWidth="1.5" />
      </svg>

      {/* Logo - top left */}
      <div className="relative z-10 px-5 py-4 sm:px-7 sm:py-5">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <img src="/SE_circlelogo.png" alt="SnapExx" className="w-8 h-8 object-contain" />
          <span className="font-bold text-base text-foreground group-hover:text-foreground transition-colors">SnapExx</span>
        </Link>
      </div>

      {/* Form content - centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6">
        {children}
      </div>

      {/* Footer legal links */}
      <div className="relative z-10 py-4 safe-area-bottom flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm sm:text-sm text-muted-foreground px-4">
        <span>© 2026 SnapExx</span>
        <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        <Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
      </div>
    </div>
  );
};

export default AuthLayout;
