import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Search, Send, X } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supportService } from "@/services/supportService";
import { useAuthContext } from "@/contexts/AuthContext";

const faqs = [
  {
    question: "What is SnapExx AI and how does it work?",
    answer: "SnapExx AI is an advanced AI-powered image editing platform that uses cutting-edge machine learning algorithms to enhance, transform, and create stunning visuals. Simply upload your images, choose your desired enhancement or generation options, and let our AI do the rest."
  },
  {
    question: "How many credits do I get with my plan?",
    answer: "Free Trial users receive 1,000 credits to start. Pro users get 10,000 credits per month, and Enterprise users have unlimited credits. Each image generation or enhancement typically uses between 1-10 credits depending on the complexity of the operation."
  },
  {
    question: "Can I use the generated images commercially?",
    answer: "Yes! All images generated or enhanced using SnapExx AI can be used for commercial purposes. You retain full ownership and rights to your creations. However, we recommend reviewing our terms of service for specific use cases."
  },
  {
    question: "What image formats are supported?",
    answer: "SnapExx AI supports all major image formats including JPEG, PNG, WebP, TIFF, and RAW files. You can export your enhanced images in any of these formats with customizable quality settings."
  },
  {
    question: "How do I upgrade to a Pro account?",
    answer: "You can upgrade to Pro by clicking the 'Upgrade to Pro' button in the sidebar or by visiting the Premium page. We accept all major credit cards and offer monthly and annual billing options with significant savings on annual plans."
  },
  {
    question: "Is my data secure on SnapExx AI?",
    answer: "Absolutely! We use enterprise-grade encryption for all data storage and transmission. Your images are processed on secure servers and are automatically deleted after processing unless you choose to save them to your workspace."
  },
  {
    question: "What should I do if I encounter an error?",
    answer: "If you encounter an error, first try refreshing the page. If the issue persists, check your internet connection and ensure your image meets our file size requirements (max 50MB). For persistent issues, contact our support team through the feedback form on your Profile page."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. If you cancel, you'll retain access to Pro features until the end of your current billing period. Your credits will expire at the end of the billing cycle."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const FAQItem = ({ 
  question, 
  answer, 
  isOpen, 
  onToggle,
}: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onToggle: () => void;
}) => {
  return (
    <div 
             className="border border-border rounded-xl overflow-hidden"
                  >
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-3 sm:p-4 md:p-6 text-left transition-all duration-300",
          isOpen ? "bg-secondary" : "hover:bg-secondary/50"
        )}
               >
        <span className="font-semibold text-xs sm:text-sm md:text-base pr-3 sm:pr-4">{question}</span>
        <div
                                className="flex-shrink-0"
        >
          {isOpen ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="overflow-hidden">
          <p className="p-3 sm:p-4 md:p-6 pt-0 text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { session, isAuthenticated } = useAuthContext();
  const location = useLocation();

  useEffect(() => {
    if ((location.state as { scrollToContact?: boolean })?.scrollToContact) {
      setTimeout(() => {
        const el = document.getElementById("contact-us");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, [location.state]);

  const handleSendMessage = async () => {
    if (!contactSubject.trim() || !contactMessage.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }

    if (!session?.user?.id) {
      toast.error("You must be signed in to contact support");
      return;
    }

    setSending(true);
    const result = await supportService.createTicket({
      userId: session.user.id,
      subject: contactSubject.trim(),
      message: contactMessage.trim(),
    });

    if (result.success) {
      toast.success("Message sent! We'll get back to you soon.");
      setContactSubject("");
      setContactMessage("");
      setContactOpen(false);
    } else {
      toast.error(result.error || "Failed to send message. Please try again.");
    }
    setSending(false);
  };

  const filteredFaqs = faqs.filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div
                                   className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div  className="flex flex-col sm:flex-row items-start gap-4 mb-6 sm:mb-8">
          <div 
            className="icon-box-blue flex-shrink-0"
                                    >
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 sm:mb-2">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed">
              Find answers to common questions about SnapExx AI
            </p>
          </div>
        </div>

        {/* Search */}
        <div  className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 sm:pl-12 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div 
          className="space-y-2 sm:space-y-3"
                   >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))
          ) : (
            <div 
                             className="text-center py-8 sm:py-12"
            >
              <p className="text-muted-foreground text-sm sm:text-base">No FAQs found matching your search.</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div 
                     className="card-elevated p-4 sm:p-6 mt-6 sm:mt-8 text-center"
                              >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
          </div>
          <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Still have questions?</h3>
          <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed max-w-md mx-auto">
            Can't find the answer you're looking for? Reach out to our support team.
          </p>
          <button 
            className="btn-primary font-bold text-sm sm:text-base"
                                      onClick={() => {
              if (!isAuthenticated) {
                toast("Please login or sign up first", {
                  description: "You need an account to contact support.",
                  action: {
                    label: "Sign Up",
                    onClick: () => window.location.href = "/register",
                  },
                });
                return;
              }
              setContactOpen(true);
            }}
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* Contact Support Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-accent" />
              Contact Support
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Subject</label>
              <Input
                placeholder="What's your question about?"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Message</label>
              <Textarea
                placeholder="Describe your issue or question..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                rows={4}
              />
            </div>
            <Button 
              className="w-full gap-2" 
              onClick={handleSendMessage}
              disabled={sending}
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FAQs;
