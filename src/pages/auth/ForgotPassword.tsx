import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Loader2, KeyRound, Lock, CheckCircle2, ShieldCheck } from "lucide-react";
import AuthLayout from "@/layouts/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold">Reset Password</CardTitle>
            <CardDescription className="text-muted-foreground">
              {step === "email" && "Enter your email to receive a verification code"}
              {step === "otp" && `Enter the 8-digit code sent to ${email}`}
              {step === "password" && "Choose a strong new password"}
            </CardDescription>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${
                      i < currentIdx
                        ? "bg-green-500 text-white"
                        : i === currentIdx
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < currentIdx ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      s.icon
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 transition-all duration-300 ${
                        i < currentIdx ? "bg-green-500" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {/* ── Step 1: Email ── */}
              {step === "email" && (
                <motion.form
                  key="email"
                  onSubmit={handleSendOtp}
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field pl-12"
                        required
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center gap-2"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
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

                  <p className="text-center text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <Link to="/signin" className="text-accent font-medium hover:underline">
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
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
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
                        className="w-10 h-12 sm:w-11 sm:h-13 text-center text-xl font-bold rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 dark:border-white/20 dark:bg-white/5"
                        disabled={isLoading}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center gap-2"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
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

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
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
                          ? "text-muted-foreground cursor-not-allowed"
                          : "text-accent hover:underline"
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
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-field pl-12"
                        required
                        minLength={8}
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                    {/* Strength bar */}
                    {newPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-right">{strength.label}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field pl-12"
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
                    className="w-full btn-primary flex items-center justify-center gap-2"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
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
          </CardContent>
        </Card>
      </motion.div>
    </AuthLayout>
  );
};

export default ForgotPassword;
