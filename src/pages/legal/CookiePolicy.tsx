import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Cookie } from "lucide-react";
import Logo from "@/components/ui/Logo";

const sections = [
  {
    number: "01",
    title: "What Are Cookies?",
    body: "Small text files stored on your device that help our Web Engine remember who you are and how you like to work. Cookies make your experience more seamless by preserving your preferences and session state.",
  },
  {
    number: "02",
    title: "Essential Cookies",
    body: "These are mandatory for Authentication. They keep you logged in as you move between the Dashboard, AI Lab, and History tabs. Without essential cookies, the application cannot function properly.",
  },
  {
    number: "03",
    title: "Preference Cookies",
    body: "These remember your customized settings, such as Dark Mode or language preferences, so you don't have to reset them every visit. They help us personalize your experience without requiring repeated configuration.",
  },
  {
    number: "04",
    title: "Analytics & Growth",
    body: "We use third-party tools like Google Analytics and Google Ads to understand how users find us and interact with our engine. This helps us grow the SnapExx ecosystem and improve our features. These cookies collect anonymized, aggregated data only.",
  },
  {
    number: "05",
    title: "Your Control",
    body: "You can manage or disable cookies through your browser settings, though some features of SnapExx may not function correctly without them. Essential cookies cannot be disabled as they are strictly necessary for the service to operate.",
  },
  {
    number: "06",
    title: "Updates to This Policy",
    body: "We may update this Cookie Policy from time to time. Any changes will be reflected on this page with an updated date. Continued use of SnapExx after changes constitutes acceptance of the updated policy.",
  },
];

const CookiePolicy = () => {
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
              <Cookie className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm font-semibold text-accent uppercase tracking-widest">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4">Cookie Policy</h1>
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
          For any cookie-related questions, contact us at{" "}
          <a href="mailto:nextera.inbox@gmail.com" className="text-accent font-medium hover:underline">
            nextera.inbox@gmail.com
          </a>
          . Also see our{" "}
          <Link to="/terms" className="text-accent font-medium hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link to="/privacy" className="text-accent font-medium hover:underline">Privacy Policy</Link>.
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicy;
