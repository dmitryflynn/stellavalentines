
import React from 'react';
import { Doodles } from './Doodles';

interface NotebookPaperProps {
  children: React.ReactNode;
}

export const NotebookPaper: React.FC<NotebookPaperProps> = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen notebook-bg flex justify-center pt-20 px-4 md:px-0">
      {/* Vertical Margin Line (The double red line) */}
      <div className="absolute left-10 md:left-40 top-0 bottom-0 w-[1px] bg-red-200" />
      <div className="absolute left-[42px] md:left-[162px] top-0 bottom-0 w-[1px] bg-red-100" />
      
      {/* Background Doodles */}
      <Doodles />
      
      <div className="relative w-full max-w-2xl z-10 font-handwritten text-2xl text-slate-700">
        {children}
      </div>
    </div>
  );
};
