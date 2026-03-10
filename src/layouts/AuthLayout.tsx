import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="relative h-dvh bg-[#0b1120] overflow-hidden flex flex-col">
      {/* Decorative background patterns */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        {/* Circle grid patterns */}
        <defs>
          <pattern id="circleGrid" x="0" y="0" width="34" height="34" patternUnits="userSpaceOnUse">
            <circle cx="17" cy="17" r="6.5" fill="none" stroke="rgba(0,255,220,0.15)" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect x="0" y="6%" width="28%" height="38%" rx="20" fill="url(#circleGrid)" />
        <rect x="66%" y="56%" width="26%" height="32%" rx="20" fill="url(#circleGrid)" />

        {/* Flowing accent curves */}
        <path d="M -20 150 Q 140 40 200 350 Q 260 680 60 880" fill="none" stroke="rgba(0,255,220,0.22)" strokeWidth="2" />
        <path d="M 980 -20 Q 1120 160 1340 100" fill="none" stroke="rgba(0,255,220,0.22)" strokeWidth="2" />
        <path d="M 1060 360 Q 1220 510 1400 680" fill="none" stroke="rgba(0,255,220,0.22)" strokeWidth="2" />
        <path d="M 380 880 Q 620 790 920 960" fill="none" stroke="rgba(0,255,220,0.16)" strokeWidth="1.5" />
      </svg>

      {/* Logo - top left */}
      <div className="relative z-10 px-5 py-4 sm:px-7 sm:py-5">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <img src="/SE_circlelogo.png" alt="SnapExx" className="w-8 h-8 object-contain" />
          <span className="font-bold text-base text-white/90 group-hover:text-white transition-colors">SnapExx</span>
        </Link>
      </div>

      {/* Form content - centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6">
        {children}
      </div>

      {/* Footer legal links */}
      <div className="relative z-10 py-4 safe-area-bottom flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[11px] sm:text-xs text-white/40 px-4">
        <span>© 2026 SnapExx</span>
        <Link to="/terms" className="hover:text-white/70 transition-colors">Terms of Service</Link>
        <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
        <Link to="/cookies" className="hover:text-white/70 transition-colors">Cookie Policy</Link>
      </div>
    </div>
  );
};

export default AuthLayout;
