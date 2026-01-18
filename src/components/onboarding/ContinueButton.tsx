import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ContinueButtonProps {
  onClick: () => void;
  label?: string;
}

const ContinueButton = ({ onClick, label = "Continue" }: ContinueButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="btn-primary flex items-center justify-center gap-2 min-w-[200px]"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
      <ArrowRight className="w-5 h-5" />
    </motion.button>
  );
};

export default ContinueButton;
