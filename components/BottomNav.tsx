
import React from 'react';
import { View, AppConfig } from '../types';

interface BottomNavProps {
  activeView: View;
  setView: (view: View) => void;
  config: AppConfig;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setView, config }) => {
  const tabs: { id: View; label: string; icon: React.ReactNode; visible: boolean }[] = [
    { 
      id: 'home', 
      label: 'Home', 
      visible: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: 'tournaments', 
      label: 'Tournaments', 
      visible: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      )
    },
    { 
      id: 'leaderboard', 
      label: 'Leaders', 
      visible: config.isLeaderboardEnabled,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'Account', 
      visible: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 px-4 py-3 flex justify-around items-center z-50 safe-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      {tabs.filter(t => t.visible).map((tab) => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            activeView === tab.id 
              ? 'text-indigo-600 scale-110' 
              : 'text-slate-400 hover:text-slate-500'
          }`}
        >
          {tab.icon}
          <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${activeView === tab.id ? 'opacity-100' : 'opacity-60'}`}>
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
