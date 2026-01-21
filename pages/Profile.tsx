
import React, { useRef } from 'react';
import { User, View, Match } from '../types';

interface ProfileProps {
  user: User | null;
  matches: Match[];
  onLogout: () => void;
  onLoginRequest: () => void;
  onSettingsClick?: () => void;
  setView?: (view: View) => void;
  onUpdateProfile?: (data: Partial<User>) => void;
  setAdminMode?: () => void; // Added for admin access
}

const Profile: React.FC<ProfileProps> = ({ user, matches, onLogout, onLoginRequest, onSettingsClick, setView, onUpdateProfile, setAdminMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateProfile) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large. Max 2MB allowed.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ profilePhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="animate-fadeIn min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="bg-white w-full rounded-[3rem] p-12 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 border-4 border-white shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Guest Account</h2>
          <p className="text-sm font-bold text-slate-400 mb-10">Sign in to track your battles and<br/>manage your winnings.</p>
          <button 
            onClick={onLoginRequest}
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-[1.75rem] shadow-2xl shadow-indigo-100 uppercase tracking-widest text-xs active:scale-95 transition-all"
          >
            SIGN IN NOW
          </button>
        </div>
      </div>
    );
  }

  const totalMatches = matches.filter(m => m.joinedPlayers.includes(user.uid)).length;
  const totalWins = matches.filter(m => m.winnerId === user.uid).length;
  const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;

  return (
    <div className="animate-fadeIn pb-10 px-1">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6 sm:mb-8 mt-4">
        <div className="relative mb-4 group cursor-pointer" onClick={handlePhotoClick}>
          <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-indigo-600 flex items-center justify-center text-3xl sm:text-4xl text-white font-black shadow-2xl shadow-indigo-100 border-4 border-white overflow-hidden relative transition-transform active:scale-95">
            {user.profilePhoto ? (
              <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user.fullName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
               <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
               </svg>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-600 border-2 sm:border-4 border-white flex items-center justify-center text-white shadow-lg group-hover:bg-indigo-700 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
          </div>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1 tracking-tight">{user.fullName || 'Elite Player'}</h2>
        <p className="text-xs sm:text-sm font-bold text-slate-400 mb-4">{user.email}</p>
      </div>

      {/* Stats Table - Matching screenshot style */}
      <div className="bg-[#1e1b4b] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-xl mb-8 border border-white/5">
         <div className="bg-indigo-600/10 px-5 sm:px-6 py-4 flex items-center gap-2 border-b border-white/5">
            <span className="text-lg">🏆</span>
            <span className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest italic">ব্যাটেল সারসংক্ষেপ</span>
         </div>
         <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
               <div className="bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm sm:text-base">💰</div>
                  <div>
                    <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-tighter">Deposit Amount</p>
                    <p className="text-base sm:text-lg font-black text-white">{user.wallet}</p>
                  </div>
               </div>
               <div className="bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm sm:text-base">📥</div>
                  <div>
                    <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-tighter">উত্তোলনযোগ্য</p>
                    <p className="text-base sm:text-lg font-black text-white">0</p>
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4 text-center">
               <div className="bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                  <p className="text-base sm:text-lg font-black text-white">{totalMatches}</p>
                  <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-tighter">Matches</p>
               </div>
               <div className="bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                  <p className="text-base sm:text-lg font-black text-white">0</p>
                  <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-tighter">Kills</p>
               </div>
               <div className="bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                  <p className="text-base sm:text-lg font-black text-white">{totalWins}</p>
                  <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-tighter">Wins</p>
               </div>
            </div>

            <button 
              onClick={() => setView && setView('history')}
              className="w-full mt-5 sm:mt-6 py-3.5 sm:py-4 bg-indigo-600/20 text-indigo-400 rounded-xl sm:rounded-2xl border border-indigo-500/20 font-black uppercase tracking-widest text-[9px] sm:text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
               Show Full Summary
            </button>
         </div>
      </div>

      {/* Account Settings Menu - Matching screenshot style */}
      <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 ml-4 tracking-[0.2em]">Account Settings</h3>
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm space-y-px mb-6 sm:mb-8">
        {/* Admin Access Button - Only shown if user.isAdmin is true */}
        {user.isAdmin && setAdminMode && (
          <button
            onClick={setAdminMode}
            className="w-full p-4 sm:p-5 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all border-b border-slate-50 group"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 uppercase tracking-tight leading-none mb-1">Admin Panel</span>
                <span className="block text-[9px] sm:text-[10px] text-purple-400 font-bold uppercase tracking-widest">Access Control Center</span>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400 group-hover:text-purple-600 transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {[
          { label: 'Edit Profile', desc: 'Update your personal information', icon: '👤', action: onSettingsClick },
          { label: 'My Matches', desc: 'View your match history', icon: '🎮', action: () => setView && setView('history') },
          { label: 'Transactions', desc: 'View your transaction history', icon: '💰', action: () => setView && setView('history') },
          { label: 'Notifications', desc: 'Manage your notifications', icon: '🔔', action: () => setView && setView('notifications') },
          { label: 'Reset Password', desc: 'Change your account password', icon: '🔒', action: onSettingsClick },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-all border-b border-slate-50 last:border-none group"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl group-hover:bg-indigo-50 transition-colors">
                {item.icon}
              </div>
              <div className="text-left">
                <span className="block text-xs sm:text-sm font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{item.label}</span>
                <span className="block text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.desc}</span>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-300 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      {/* Developer Information */}
      <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 ml-4 tracking-[0.2em]">Developer Information</h3>
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm mb-8 sm:mb-10">
         <button className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-all group">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-xs sm:text-sm font-black text-slate-800 uppercase tracking-tight leading-none mb-1">About Developers</span>
                <span className="block text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">View developer information</span>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-300 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
         </button>
      </div>

      <button
        onClick={onLogout}
        className="w-full py-5 bg-red-50 text-red-500 font-black uppercase tracking-[0.2em] text-[10px] rounded-[1.75rem] transition-all border border-red-100 active:scale-95 flex items-center justify-center gap-3 mb-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7" />
        </svg>
        Logout
      </button>
    </div>
  );
};

export default Profile;
