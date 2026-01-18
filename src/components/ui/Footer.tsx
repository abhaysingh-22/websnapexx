import { Link } from "react-router-dom";
import { Linkedin, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import Logo from "@/components/ui/Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Us */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-accent mb-4">ABOUT US</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SnapExx AI is a cutting-edge photo editing platform powered by artificial intelligence. 
              We transform ordinary images into stunning visuals with professional-grade enhancements, 
              AI portraits, and creative tools that help photographers, creators, and businesses 
              achieve their visual goals effortlessly.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-accent mb-4">CONTACT US</h3>
            <div className="space-y-3">
              <a 
                href="tel:+1-555-123-4567" 
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </a>
              <a 
                href="mailto:support@snapexx.ai" 
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@snapexx.ai
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                San Francisco, CA 94102
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-accent mb-4">QUICK LINKS</h3>
            <div className="space-y-2">
              <Link 
                to="/home" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/premium" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Premium Plans
              </Link>
              <Link 
                to="/faqs" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQs
              </Link>
              <Link 
                to="/history" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                History
              </Link>
            </div>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-accent mb-4">CONNECT WITH US</h3>
            <div className="flex gap-3 mb-6">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Stay updated with our latest features and tips.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <span className="text-sm text-muted-foreground">
              © {currentYear} SnapExx AI. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;