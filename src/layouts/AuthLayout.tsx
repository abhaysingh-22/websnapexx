import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import editorInterface from "@/assets/editor-interface.jpg";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden rounded-none">
        <img 
          src={editorInterface} 
          alt="AI Photo Editing Interface" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient overlay: dark at left (for text legibility), fades to reveal image */}
        <div className="auth-hero-overlay" />
        
        <div className="relative z-10 p-8 lg:p-10 xl:p-12 flex flex-col h-full">
          {/* Force white logo text always — hero is always over a dark overlay */}
          <div className="flex items-center gap-3">
            <img src="/SE_circlelogo.png" alt="SnapExx" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="font-bold text-xl text-white drop-shadow-md">SnapExx</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>
              Join the Future of<br />AI Photo Editing
            </h1>
            <p className="text-white/90 text-base lg:text-lg" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>
              Experience the NextEra of professional photo dashboard and advanced AI editing tools. 
              Unleash your creativity with seamless neural processing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-white/75 text-xs lg:text-sm">
            <span>© 2026 SnapExx</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-12 bg-background min-h-screen">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8">
          <Logo size="lg" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
