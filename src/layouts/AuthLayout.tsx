import { ReactNode } from "react";
import Logo from "@/components/ui/Logo";
import editorInterface from "@/assets/editor-interface.jpg";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src={editorInterface} 
          alt="AI Photo Editing Interface" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="auth-hero-overlay" />
        
        <div className="relative z-10 p-12 flex flex-col">
          <Logo variant="light" size="md" />
          
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <h1 className="text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              Join the Future of<br />AI Photo Editing
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Experience the NextEra of professional photo dashboard and advanced AI editing tools. 
              Unleash your creativity with seamless neural processing.
            </p>
          </div>

          <div className="flex items-center gap-6 text-primary-foreground/70 text-sm">
            <span>© 2024 NextEra Labs</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 bg-background">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
