import { Link } from "react-router-dom";
import { Linkedin, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
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
        className="max-w-7xl mx-auto px-4 md:px-8 py-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Us */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-bold tracking-widest text-accent uppercase mb-4">About Us</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SnapExx AI is a cutting-edge photo editing platform powered by artificial intelligence. 
              We transform ordinary images into stunning visuals with professional-grade enhancements, 
              AI portraits, and creative tools that help photographers, creators, and businesses 
              achieve their visual goals effortlessly.
            </p>
          </motion.div>

          {/* Contact Us */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-bold tracking-widest text-accent uppercase mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a 
                href="tel:+917983957734" 
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">+91 7983957734</span>
              </a>
              <a 
                href="mailto:nextera.inbox@gmail.com" 
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">nextera.inbox@gmail.com</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>San Francisco, CA 94102</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-bold tracking-widest text-accent uppercase mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link 
                to="/home" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 font-medium"
              >
                Home
              </Link>
              <Link 
                to="/premium" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 font-medium"
              >
                Premium Plans
              </Link>
              <Link 
                to="/faqs" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 font-medium"
              >
                FAQs
              </Link>
              <Link 
                to="/history" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 font-medium"
              >
                History
              </Link>
            </div>
          </motion.div>

          {/* Connect With Us */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-bold tracking-widest text-accent uppercase mb-4">Follow Us On</h3>
            <div className="flex gap-3 mb-6">
              <a 
                href="https://www.linkedin.com/company/nextera-build/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/nextera.build?utm_source=qr&igsh=MWRmbjkxd2ZhYWl2bQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/build_nextera" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Stay updated with our latest features, tips, and AI-powered innovations.
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <span className="text-sm text-muted-foreground font-medium">
              © {currentYear} SnapExx AI. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 font-medium">
              Terms of Service
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 font-medium">
              Privacy Policy
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 font-medium">
              Cookie Policy
            </button>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;