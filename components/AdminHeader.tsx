
import React from 'react';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white px-4 sm:px-8 py-5 sm:py-7 flex items-center justify-between sticky top-0 z-40 border-b border-slate-100">
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        <div className="w-1 h-8 sm:w-1.5 sm:h-10 blue-gradient rounded-full shrink-0"></div>
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tighter leading-none font-gaming italic truncate">FFAdmin</h1>
            <div className="bg-indigo-600 text-white text-[6px] sm:text-[7px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-widest border border-white/20 shrink-0">V2.4</div>
          </div>
          <div className="flex items-center gap-2 mt-1 sm:mt-1.5">
             <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest sm:tracking-[0.2em]">Active Super Admin</p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onLogout} 
        className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center border border-slate-100 shadow-soft text-slate-400 active:scale-95 hover:bg-red-50 hover:text-red-500 transition-all group shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7" />
        </svg>
      </button>
    </header>
  );
};

export default AdminHeader;
