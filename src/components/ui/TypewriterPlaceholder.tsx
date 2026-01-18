import { useState, useEffect, useRef } from "react";

interface TypewriterPlaceholderProps {
  placeholder: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

const TypewriterPlaceholder = ({ 
  placeholder, 
  className = "", 
  value, 
  onChange 
}: TypewriterPlaceholderProps) => {
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    if (value) return; // Don't animate if there's user input

    const typeInterval = setInterval(() => {
      if (isTyping) {
        if (indexRef.current < placeholder.length) {
          setDisplayedPlaceholder(placeholder.slice(0, indexRef.current + 1));
          indexRef.current++;
        } else {
          setTimeout(() => setIsTyping(false), 2000);
        }
      } else {
        if (indexRef.current > 0) {
          setDisplayedPlaceholder(placeholder.slice(0, indexRef.current - 1));
          indexRef.current--;
        } else {
          setTimeout(() => setIsTyping(true), 500);
        }
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [placeholder, isTyping, value]);

  return (
    <textarea 
      placeholder={value ? "" : displayedPlaceholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  );
};

export default TypewriterPlaceholder;
