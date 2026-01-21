
import React from 'react';
import { Match, User, MatchStatus } from '../types';

interface MatchCardProps {
  match: Match;
  onJoin: (id: string) => void;
  currentUser: User | null;
  users: User[];
  onClick?: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onJoin, currentUser, onClick }) => {
  const isJoined = currentUser ? match.joinedPlayers.includes(currentUser.uid) : false;
  const progress = (match.joinedPlayers.length / match.maxPlayers) * 100;
  const slotsLeft = match.maxPlayers - match.joinedPlayers.length;

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
           ' • ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-[2.25rem] p-3 shadow-xl border border-slate-100 relative overflow-hidden group mb-5">
      {/* Top Badge Bar - Screenshot style with Dark Pills */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-3 px-1 gap-2 sm:gap-4">
        <div className="flex-1 bg-[#1e1b4b] text-white px-3 py-2 rounded-full flex items-center justify-center border border-white/10 shadow-lg">
           <div className="flex items-center gap-1.5 overflow-hidden">
             <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
               <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
             </div>
             <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-300 truncate">ENTRY: <span className="text-[11px] sm:text-[13px] tracking-normal text-white ml-1 font-bold">{match.mode}</span></span>
           </div>
        </div>
        
        <div className="flex-1 bg-[#1e1b4b] text-white px-3 py-2 rounded-full flex items-center justify-center border border-white/10 shadow-lg">
           <div className="flex items-center gap-1.5 overflow-hidden">
             <div className="w-5 h-5 bg-amber-500/20 rounded-lg flex items-center justify-center shrink-0">
               <span className="text-[10px]">🪙</span>
             </div>
             <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-300 truncate">Fee: <span className="text-[11px] sm:text-[13px] tracking-normal text-white ml-1 font-bold">{match.entryFee}</span></span>
           </div>
        </div>
      </div>

      {/* Main Image with Card Overlay */}
      <div className="relative h-52 rounded-[1.75rem] overflow-hidden mb-4 shadow-inner">
        <img 
          src={match.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"} 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        {/* Banner Overlay Info Box */}
        <div className="absolute inset-x-3 bottom-3 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl">
           <h3 className="text-white font-black text-lg mb-2 leading-tight uppercase line-clamp-1">{match.detailedRules || match.title}</h3>
           <div className="flex justify-between items-center text-white/80">
              <div className="flex items-center gap-2">
                 <span className="text-lg">🏆</span>
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Prize Pool</span>
                    <span className="text-amber-400 text-xs font-black uppercase tracking-tight">৳ {match.prize}</span>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-lg">💀</span>
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Per Kill</span>
                    <span className="text-red-400 text-xs font-black uppercase tracking-tight">৳ {match.perKill || 0}</span>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-white">{formatDateShort(match.startTime)}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{match.map}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Participant Stats Area */}
      <div className="px-2 mb-4">
        <div className="flex justify-between items-center mb-1.5">
           <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
              <span className="text-xs font-black text-slate-700 uppercase">{match.joinedPlayers.length}/{match.maxPlayers} Players</span>
           </div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{slotsLeft} Spots Left</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
           <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 px-1 pb-1">
        <button 
          onClick={onClick}
          className="w-full sm:flex-1 bg-slate-100 text-indigo-600 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 font-black uppercase text-[10px] tracking-widest border border-slate-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          Details
        </button>
        <button 
          onClick={() => onJoin(match.id)}
          disabled={isJoined || slotsLeft <= 0}
          className={`w-full sm:flex-[1.2] py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl font-black uppercase text-[10px] tracking-widest ${
            isJoined || slotsLeft <= 0 
              ? 'bg-slate-200 text-slate-400 cursor-default shadow-none' 
              : 'blue-gradient text-white'
          }`}
        >
           {slotsLeft <= 0 ? (
             <>Full <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg></>
           ) : isJoined ? (
             <>Joined <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></>
           ) : (
             <>Join Now <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>
           )}
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
