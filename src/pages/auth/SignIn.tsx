import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import AuthLayout from "@/layouts/AuthLayout";
import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password, rememberMe);
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message || "Failed to sign in");
      }
      setIsLoading(false);
      return;
    }

    toast.success("Welcome back!");
    navigate('/app/home');
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message || 'Failed to sign in with Google');
      setIsLoading(false);
      return;
    }
  };

  return (
    <AuthLayout>
      <div 
        className="w-full max-w-[400px] bg-white/[0.04] border border-white/[0.08] rounded-xl px-6 py-6 sm:px-8 sm:py-7 backdrop-blur-sm shadow-2xl shadow-black/20"
                                 >
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/50 mt-1.5 text-xs">
            Sign in to continue your creative journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition-all text-xs"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition-all text-xs"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-white/20 bg-white/5 accent-cyan-400"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-white/40">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-cyan-400 hover:text-cyan-300 hover:underline text-xs font-medium">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-500 text-gray-900 font-semibold text-xs flex items-center justify-center gap-2 hover:from-cyan-300 hover:to-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                      disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 border-t border-white/10" />
          <span className="text-[11px] text-white/30 uppercase tracking-wider">or</span>
          <div className="flex-1 border-t border-white/10" />
        </div>

        {/* Google button */}
        <button 
          className="w-full flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-white/80 text-xs font-medium transition-colors disabled:opacity-50"
          disabled={isLoading}
          type="button"
          onClick={handleGoogle}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Create account link */}
        <p className="text-center text-xs text-white/40 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-400 font-medium hover:text-cyan-300 hover:underline">
            Create Account
          </Link>
        </p>

        {/* Legal note */}
        <p className="text-center text-[11px] text-white/25 mt-3">
          By signing in, you agree to our{" "}
          <Link to="/terms" target="_blank" className="text-white/40 hover:text-cyan-400 hover:underline">Terms of Service</Link>
          ,{" "}
          <Link to="/privacy" target="_blank" className="text-white/40 hover:text-cyan-400 hover:underline">Privacy Policy</Link>
          , and{" "}
          <Link to="/cookies" target="_blank" className="text-white/40 hover:text-cyan-400 hover:underline">Cookie Policy</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignIn;