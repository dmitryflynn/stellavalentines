import React, { useState } from 'react';

interface ValentineQuestionProps {
  onYes: () => void;
}

export const ValentineQuestion: React.FC<ValentineQuestionProps> = ({ onYes }) => {
  const [noPosition, setNoPosition] = useState({ top: 0, left: 0 });
  const [isMoved, setIsMoved] = useState(false);

  const handleNoInteraction = () => {
    const randomTop = Math.random() * (window.innerHeight - 100);
    const randomLeft = Math.random() * (window.innerWidth - 100);
    setNoPosition({ top: randomTop, left: randomLeft });
    setIsMoved(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-[fadeIn_1s_ease-out]">
      <h2 className="text-4xl md:text-6xl lg:text-7xl mb-12 md:mb-16 text-center text-rose-800 font-handwritten max-w-2xl">
        Will you be my Valentine?
      </h2>
      
      <div className="flex gap-4 md:gap-8 lg:gap-12 relative">
        <button
          onClick={onYes}
          className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 md:px-12 md:py-5 lg:px-14 lg:py-6 rounded-2xl text-3xl md:text-4xl lg:text-5xl shadow-[4px_4px_0px_rgba(159,18,57,1)] md:shadow-[6px_6px_0px_rgba(159,18,57,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-handwritten"
        >
          Yes!
        </button>

        <button
          onMouseEnter={handleNoInteraction}
          onClick={handleNoInteraction}
          onTouchStart={handleNoInteraction}
          style={isMoved ? { 
            position: 'fixed', 
            top: `${noPosition.top}px`, 
            left: `${noPosition.left}px`,
            transition: 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            zIndex: 9999
          } : {}}
          className="bg-slate-100 hover:bg-slate-200 text-slate-400 px-8 py-4 md:px-12 md:py-5 lg:px-14 lg:py-6 rounded-2xl text-3xl md:text-4xl lg:text-5xl border-2 border-slate-200 font-handwritten"
        >
          No
        </button>
      </div>
    </div>
  );
};