import { ReactNode } from "react";
import Logo from "@/components/ui/Logo";
import Footer from "@/components/ui/Footer";
import editorInterface from "@/assets/editor-interface.jpg";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Left Side - Hero */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative">
          <img 
            src={editorInterface} 
            alt="AI Photo Editing Interface" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="auth-hero-overlay" />
          
          <div className="relative z-10 p-8 lg:p-10 xl:p-12 flex flex-col">
            <Logo variant="light" size="md" />
            
            <div className="flex-1 flex flex-col justify-center max-w-lg">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-foreground mb-4 lg:mb-6 leading-tight">
                Join the Future of<br />AI Photo Editing
              </h1>
              <p className="text-primary-foreground/80 text-base lg:text-lg">
                Experience the NextEra of professional photo dashboard and advanced AI editing tools. 
                Unleash your creativity with seamless neural processing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-primary-foreground/70 text-xs lg:text-sm">
              <span>© 2024 NextEra Labs</span>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-12 bg-background">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 sm:mb-8">
            <Logo size="lg" />
          </div>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthLayout;
