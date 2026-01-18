import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

const FAQItem = ({ 
  question, 
  answer, 
  isOpen, 
  onToggle 
}: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onToggle: () => void; 
}) => {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 md:p-6 text-left transition-colors",
          isOpen ? "bg-secondary" : "hover:bg-secondary/50"
        )}
      >
        <span className="font-medium text-sm md:text-base pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-accent flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="p-4 md:p-6 pt-0 md:pt-0 text-muted-foreground text-sm md:text-base leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </div>
  );
};

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="icon-box-blue">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold italic mb-2">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground">
              Find answers to common questions about SnapExx AI
            </p>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Contact Support */}
        <div className="card-elevated p-6 mt-8 text-center">
          <h3 className="font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Can't find the answer you're looking for? Reach out to our support team.
          </p>
          <button className="btn-primary">Contact Support</button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default FAQs;
