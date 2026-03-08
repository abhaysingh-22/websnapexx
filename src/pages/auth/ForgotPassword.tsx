import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Loader2, KeyRound, Lock, CheckCircle2, ShieldCheck } from "lucide-react";
import AuthLayout from "@/layouts/AuthLayout";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Step = "email" | "otp" | "password";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, updatePassword, signOut } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // ── Step 1: Send OTP ──
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await sendOtp(email);

    if (error) {
      toast.error(error.message || "Failed to send OTP");
      setIsLoading(false);
      return;
    }

    toast.success("OTP sent to your email!");
    setCooldown(60);
    setStep("otp");
    setIsLoading(false);
  };

  // ── Step 2: Verify OTP ──
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("");
    if (token.length !== 8) {
      toast.error("Please enter the complete 8-digit code");
      return;
    }

    setIsLoading(true);

    const { error } = await verifyOtp(email, token);

    if (error) {
      toast.error(error.message || "Invalid or expired OTP");
      setIsLoading(false);
      return;
    }

    toast.success("OTP verified!");
    setStep("password");
    setIsLoading(false);
  };

  // ── Step 3: Update Password ──
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const { error } = await updatePassword(newPassword);

    if (error) {
      toast.error(error.message || "Failed to update password");
      setIsLoading(false);
      return;
    }

    // Sign out so the user logs in fresh with new password
    await signOut();
    toast.success("Password updated! Please sign in with your new password.");
    navigate("/signin");
  };

  // Resend OTP
  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsLoading(true);

    const { error } = await sendOtp(email);

    if (error) {
      toast.error(error.message || "Failed to resend OTP");
      setIsLoading(false);
      return;
    }

    toast.success("OTP resent!");
    setCooldown(60);
    setOtp(["", "", "", "", "", "", "", ""]);
    setIsLoading(false);
  };

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 7) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    if (!pasted) return;
    const next = [...otp];
    for (let i = 0; i < 8; i++) {
      next[i] = pasted[i] || "";
    }
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 7);
    otpRefs.current[focusIdx]?.focus();
  };

  // Password strength
  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
    if (score === 2) return { label: "Fair", color: "bg-yellow-500", width: "w-2/4" };
    if (score === 3) return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  };

  const strength = getPasswordStrength(newPassword);

  // Step indicator
  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
    { key: "otp", label: "Verify", icon: <ShieldCheck className="w-4 h-4" /> },
    { key: "password", label: "Reset", icon: <KeyRound className="w-4 h-4" /> },
  ];

  const currentIdx = steps.findIndex((s) => s.key === step);

  return (
    <AuthLayout>
      <motion.div
        className="w-full max-w-[400px] bg-white/[0.04] border border-white/[0.08] rounded-xl px-6 py-6 sm:px-8 sm:py-7 backdrop-blur-sm shadow-2xl shadow-black/20"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-white/50 mt-1.5 text-xs">
            {step === "email" && "Enter your email to receive a verification code"}
            {step === "otp" && `Enter the 8-digit code sent to ${email}`}
            {step === "password" && "Choose a strong new password"}
          </p>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 pt-3">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold transition-all duration-300 ${
                    i < currentIdx
                      ? "bg-green-500 text-white"
                      : i === currentIdx
                        ? "bg-cyan-400 text-gray-900"
                        : "bg-white/10 text-white/40"
                  }`}
                >
                  {i < currentIdx ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    s.icon
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-7 h-0.5 transition-all duration-300 ${
                      i < currentIdx ? "bg-green-500" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
            <AnimatePresence mode="wait">
              {/* ── Step 1: Email ── */}
              {step === "email" && (
                <motion.form
                  key="email"
                  onSubmit={handleSendOtp}
                  className="space-y-3.5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
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
                        autoFocus
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-500 text-gray-900 font-semibold text-xs flex items-center justify-center gap-2 hover:from-cyan-300 hover:to-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.99 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-xs text-white/40">
                    Remember your password?{" "}
                    <Link to="/signin" className="text-cyan-400 font-medium hover:text-cyan-300 hover:underline">
                      Sign In
                    </Link>
                  </p>
                </motion.form>
              )}

              {/* ── Step 2: OTP ── */}
              {step === "otp" && (
                <motion.form
                  key="otp"
                  onSubmit={handleVerifyOtp}
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-center gap-1.5 sm:gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-9 h-10 sm:w-10 sm:h-11 text-center text-lg font-bold rounded-lg border border-white/10 bg-white/[0.06] text-white focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition-all duration-200"
                        disabled={isLoading}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-500 text-gray-900 font-semibold text-xs flex items-center justify-center gap-2 hover:from-cyan-300 hover:to-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.99 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Code
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Change email
                    </button>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={cooldown > 0 || isLoading}
                      className={`font-medium transition-colors ${
                        cooldown > 0
                          ? "text-white/30 cursor-not-allowed"
                          : "text-cyan-400 hover:text-cyan-300 hover:underline"
                      }`}
                    >
                      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* ── Step 3: New Password ── */}
              {step === "password" && (
                <motion.form
                  key="password"
                  onSubmit={handleUpdatePassword}
                  className="space-y-3.5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition-all text-xs"
                        required
                        minLength={8}
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    {/* Strength bar */}
                    {newPassword && (
                      <div className="mt-1.5 space-y-0.5">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                          />
                        </div>
                        <p className="text-[10px] text-white/40 text-right">{strength.label}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition-all text-xs"
                        required
                        minLength={8}
                        disabled={isLoading}
                      />
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-500 text-gray-900 font-semibold text-xs flex items-center justify-center gap-2 hover:from-cyan-300 hover:to-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.99 }}
                    disabled={isLoading || (confirmPassword.length > 0 && newPassword !== confirmPassword)}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        Update Password
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default ForgotPassword;
