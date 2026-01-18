import { Link } from "react-router-dom";
import { Linkedin, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="bg-card border-t border-border">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* About Us */}
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold tracking-widest text-accent uppercase mb-3 sm:mb-4">About Us</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SnapExx AI is a cutting-edge photo editing platform powered by artificial intelligence. 
              We transform ordinary images into stunning visuals with professional-grade enhancements.
            </p>
          </motion.div>

          {/* Contact Us */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-bold tracking-widest text-accent uppercase mb-3 sm:mb-4">Contact Us</h3>
            <div className="space-y-2 sm:space-y-3">
              <a 
                href="tel:+917983957734" 
                className="flex items-center gap-2 sm:gap-3 text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">+91 7983957734</span>
              </a>
              <a 
                href="mailto:nextera.inbox@gmail.com" 
                className="flex items-center gap-2 sm:gap-3 text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium break-all">nextera.inbox@gmail.com</span>
              </a>
              <div className="flex items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-bold tracking-widest text-accent uppercase mb-3 sm:mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              {[
                { to: "/home", label: "Home" },
                { to: "/premium", label: "Premium Plans" },
                { to: "/faqs", label: "FAQs" },
                { to: "/history", label: "History" },
              ].map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 font-medium flex items-center gap-1 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Connect With Us */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-bold tracking-widest text-accent uppercase mb-3 sm:mb-4">Follow Us On</h3>
            <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
              <a 
                href="https://www.linkedin.com/company/nextera-build/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://www.instagram.com/nextera.build?utm_source=qr&igsh=MWRmbjkxd2ZhYWl2bQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://x.com/build_nextera" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Stay updated with our latest features and AI innovations.
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <Logo size="sm" />
            <span className="text-xs sm:text-sm text-muted-foreground font-medium text-center sm:text-left">
              © {currentYear} SnapExx AI. All rights reserved.
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <button className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-all duration-300 font-medium">
              Terms of Service
            </button>
            <button className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-all duration-300 font-medium">
              Privacy Policy
            </button>
            <button className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-all duration-300 font-medium">
              Cookie Policy
            </button>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;