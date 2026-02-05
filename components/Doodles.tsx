
import React from 'react';

const HeartDoodle = () => (
  <svg width="60" height="60" viewBox="0 0 100 100" className="text-rose-300 fill-none stroke-current stroke-[3] opacity-60">
    <path d="M50,30 C35,10 10,25 10,45 C10,65 50,90 50,90 C50,90 90,65 90,45 C90,25 65,10 50,30 Z" 
      style={{ strokeDasharray: '200', strokeDashoffset: '0', strokeLinecap: 'round' }}
    />
  </svg>
);

const XOXODoodle = () => (
  <div className="text-rose-400 opacity-40 font-handwritten text-4xl select-none rotate-[-15deg]">
    XOXO
  </div>
);

const StarDoodle = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" className="text-amber-300 fill-none stroke-current stroke-[3] opacity-50">
    <path d="M50 5 L63 38 L98 38 L70 59 L81 92 L50 72 L19 92 L30 59 L2 38 L37 38 Z" strokeLinecap="round" />
  </svg>
);

const SwirlDoodle = () => (
  <svg width="50" height="50" viewBox="0 0 100 100" className="text-rose-200 fill-none stroke-current stroke-[2] opacity-50">
    <path d="M50 50 Q70 20 90 50 Q70 80 50 50 Q30 20 10 50 Q30 80 50 50" strokeLinecap="round" />
  </svg>
);

const FlowerDoodle = () => (
  <svg width="50" height="50" viewBox="0 0 100 100" className="text-pink-300 fill-none stroke-current stroke-[2] opacity-60">
    <circle cx="50" cy="50" r="10" />
    <path d="M50 40 Q50 10 60 40 M60 50 Q90 50 60 60 M50 60 Q50 90 40 60 M40 50 Q10 50 40 40" strokeLinecap="round" />
  </svg>
);

export const Doodles: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top Left */}
      <div className="absolute top-10 left-5 animate-float">
        <HeartDoodle />
      </div>
      <div className="absolute top-32 left-16 animate-float-delayed">
        <XOXODoodle />
      </div>

      {/* Top Right */}
      <div className="absolute top-20 right-10 animate-float-slow">
        <StarDoodle />
      </div>
      <div className="absolute top-52 right-24 opacity-30 font-handwritten text-3xl text-rose-300 rotate-12">
        You + Me
      </div>

      {/* Bottom Left */}
      <div className="absolute bottom-20 left-8 animate-float-slow">
        <FlowerDoodle />
      </div>
      <div className="absolute bottom-40 left-20 rotate-[-10deg]">
        <SwirlDoodle />
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-10 right-10 animate-float">
        <HeartDoodle />
      </div>
      <div className="absolute bottom-32 right-16 animate-float-delayed">
        <XOXODoodle />
      </div>
      
      {/* Scattered small hearts */}
      <div className="absolute top-1/4 right-1/3 opacity-20"><HeartDoodle /></div>
      <div className="absolute bottom-1/3 left-1/4 opacity-20 rotate-45"><HeartDoodle /></div>
    </div>
  );
};
