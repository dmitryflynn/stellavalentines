
import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 40, 
  delay = 0, 
  className = "",
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay, text]);

  useEffect(() => {
    if (!started) return;
    
    setDisplayedText(""); // Reset when text changes
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, started, speed, onComplete]);

  return (
    <span className={`${className} inline-block`}>
      {displayedText}
      <span className="animate-pulse opacity-50 ml-1">|</span>
    </span>
  );
};
