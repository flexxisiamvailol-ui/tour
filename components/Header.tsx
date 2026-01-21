
import React from 'react';
import { AppConfig } from '../types';

interface HeaderProps {
  config?: AppConfig;
  title?: string;
  subtitle?: string;
  onNotifyClick?: () => void;
  showBack?: boolean;
  onBack?: () => void;
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ config, title, onNotifyClick, showBack, onBack, onLogoClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between border-b border-slate-100">
      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
        {showBack ? (
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="flex items-center gap-2 overflow-hidden" onClick={onLogoClick}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border-2 border-slate-100 shadow-sm overflow-hidden shrink-0">
               {config?.appLogoUrl ? (
                 <img src={config.appLogoUrl} alt="Logo" className="w-full h-full object-cover" />
               ) : (
                 <span className="text-base sm:text-lg">E</span>
               )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-base sm:text-lg font-extrabold text-slate-800 leading-none tracking-tight truncate">
                {config?.appName || 'EliteZone'}
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">
                Tournament Hub
              </span>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={onNotifyClick}
        className="relative p-2 sm:p-2.5 bg-slate-50 rounded-full hover:bg-slate-100 transition-all border border-slate-100 shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
    </header>
  );
};

export default Header;
