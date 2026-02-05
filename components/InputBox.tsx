
import React, { useState, useEffect } from 'react';

interface InputBoxProps {
  onConfirm: (value: string) => void;
  isError: boolean;
}

export const InputBox: React.FC<InputBoxProps> = ({ onConfirm, isError }) => {
  const [value, setValue] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isError) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onConfirm(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`mt-8 transition-transform duration-100 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type answer here..."
          className="bg-transparent border-b-2 border-dashed border-rose-300 focus:border-rose-500 outline-none w-full py-2 px-1 text-4xl placeholder:opacity-20 transition-colors font-handwritten text-rose-700"
          autoFocus
        />
        {/* Sketchy underline decoration */}
        <div className="absolute -bottom-1 left-0 w-full h-1 bg-rose-100 opacity-50 skew-x-[-15deg]" />
      </div>
      
      <p className="text-sm mt-4 opacity-40 font-sans italic text-rose-900">Press Enter to check...</p>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
      `}</style>
    </form>
  );
};
