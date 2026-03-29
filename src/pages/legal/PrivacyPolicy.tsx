import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useSEO } from "@/hooks/useSEO";

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
  const seo = useSEO({
    title: "Privacy Policy - SnapExx",
    description: "Learn how SnapExx protects your privacy and handles your data. Read our comprehensive privacy policy for transparent data practices.",
    url: "https://snapexx.tech/privacy",
  });

  return (
    <>
      <seo.Helmet />
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
        <div className="mb-16 border-b border-border/50 pb-8">
          <div className="flex items-center gap-2 mb-6 text-sm font-medium text-accent">
            <ShieldCheck className="w-4 h-4" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Effective as of February 2026
          </p>
        </div>

        {/* Sections */}
        <div className="max-w-3xl space-y-12">
          {sections.map((section) => (
            <section key={section.number} className="scroll-m-20">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-4">
                {parseInt(section.number)}. {section.title}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div
                                           className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl bg-accent/10 border border-accent/30 dark:bg-accent/5 dark:border-accent/20 text-sm text-muted-foreground"
        >
          For any privacy-related questions, contact us at{" "}
          <a href="mailto:nextera.inbox@gmail.com" className="text-accent font-medium hover:underline">
            nextera.inbox@gmail.com
          </a>
          . Also see our{" "}
          <Link to="/terms" className="text-accent font-medium hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link to="/cookies" className="text-accent font-medium hover:underline">Cookie Policy</Link>.
        </div>
      </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
