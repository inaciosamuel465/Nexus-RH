import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import HRAssistant from '../pages/HRAssistant';

const FloatingAIBtn: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[500] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[450px] h-[600px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-slideIn">
          <div className="p-4 bg-slate-900 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 flex items-center justify-center font-bold italic">N</div>
              <span className="text-xs font-bold uppercase tracking-widest italic">Nexus Assistente IA</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <HRAssistant embedded />
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group relative ${isOpen ? 'rotate-90' : ''}`}
      >
        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity animate-pulse"></div>
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        )}
      </button>
    </div>
  );
};

export default FloatingAIBtn;
