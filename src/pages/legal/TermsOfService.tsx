import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useSEO } from "@/hooks/useSEO";

const sections = [
  {
    number: "01",
    title: "Welcome to SnapExx",
    body: "By using our Web Engine and Mobile App, you agree to the following terms. Please read them carefully before proceeding.",
  },
  {
    number: "02",
    title: "User Eligibility",
    body: "You must be at least 13 years of age to use this service. By accessing SnapExx, you represent and warrant that you meet this age requirement.",
  },
  {
    number: "03",
    title: "Ownership of Content",
    body: "You retain full ownership and commercial rights to the images you generate using SnapExx. We claim no rights over your creations. Your work remains entirely yours.",
  },
  {
    number: "04",
    title: "Prohibited Use",
    body: "You agree not to use SnapExx to generate illegal, harmful, or deepfake content of real individuals without their explicit consent. Misuse will result in an immediate account ban and potential legal action.",
  },
  {
    number: "05",
    title: "Payments & Refunds",
    body: "Due to the high computational costs of AI processing, all payments for FLEX and POWER plans are non-refundable once the transaction is complete. Please review your plan before purchasing.",
  },
  {
    number: "06",
    title: "Limitation of Liability",
    body: 'SnapExx is provided "as is." While we strive for perfection, we are not responsible for AI-generated artifacts or temporary service downtimes. We make no warranties, express or implied, regarding uninterrupted access.',
  },
];

const TermsOfService = () => {
  const navigate = useNavigate();
  const seo = useSEO({
    title: "Terms of Service - SnapExx",
    description: "Review SnapExx's terms of service. Understand your rights and responsibilities when using our AI image and video generation platform.",
    url: "https://snapexx.tech/terms",
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
            <FileText className="w-4 h-4" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Terms of Service
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
          For any questions regarding these terms, contact us at{" "}
          <a href="mailto:nextera.inbox@gmail.com" className="text-accent font-medium hover:underline">
            nextera.inbox@gmail.com
          </a>
          . Also see our{" "}
          <Link to="/privacy" className="text-accent font-medium hover:underline">Privacy Policy</Link>
          {" "}and{" "}
          <Link to="/cookies" className="text-accent font-medium hover:underline">Cookie Policy</Link>.
        </div>
      </div>
      </div>
    </>
  );
};

export default TermsOfService;
