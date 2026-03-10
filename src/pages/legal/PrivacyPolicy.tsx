import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Logo from "@/components/ui/Logo";

const sections = [
  {
    number: "01",
    title: "Your Privacy is Our Priority",
    body: "Here is how we handle your data. We are committed to being transparent about the information we collect and how it is used.",
  },
  {
    number: "02",
    title: "Information Collection",
    body: "We collect your email address for account management, along with basic browser data and feedback provided through our platform. We do not collect sensitive personal information beyond what is necessary to provide the service.",
  },
  {
    number: "03",
    title: "Data Usage",
    body: "Your data is used solely to provide our AI services, process your requests, and improve our generation models. We do not use your data for advertising or sell it to third parties.",
  },
  {
    number: "04",
    title: "72-Hour Purge Policy",
    body: "To ensure your privacy, all generated images and session history are automatically deleted from our servers every 3 days (72 hours) unless manually saved by the user. This ensures your creative work remains under your control.",
  },
  {
    number: "05",
    title: "Secure Third Parties",
    body: "We partner with industry leaders like Supabase for secure data management. Your data is encrypted in transit and at rest, and is never sold or shared with unauthorized third parties.",
  },
  {
    number: "06",
    title: "User Rights",
    body: "You have the right to delete your account and all associated data at any time through your dashboard settings. Upon account deletion, all your personal data is permanently removed from our systems.",
  },
];

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm font-semibold text-accent uppercase tracking-widest">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Last updated: February 2026
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-colors"
            >
              <span className="text-3xl font-extrabold text-accent/20 leading-none select-none hidden sm:block">
                {section.number}
              </span>
              <div>
                <h2 className="text-lg font-bold text-foreground mb-2">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl bg-accent/5 border border-accent/20 text-sm text-muted-foreground"
        >
          For any privacy-related questions, contact us at{" "}
          <a href="mailto:nextera.inbox@gmail.com" className="text-accent font-medium hover:underline">
            nextera.inbox@gmail.com
          </a>
          . Also see our{" "}
          <Link to="/terms" className="text-accent font-medium hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link to="/cookies" className="text-accent font-medium hover:underline">Cookie Policy</Link>.
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
