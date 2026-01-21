
import React, { useState } from 'react';
import { Match, User, View } from '../types';

interface MatchDetailsProps {
  match: Match;
  onJoin: (id: string, gameName?: string, slotNumber?: number) => void;
  currentUser: User | null;
  onBack: () => void;
  setView: (view: View) => void;
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ match, onJoin, currentUser, onBack, setView }) => {
  const [showRegModal, setShowRegModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);
  const [gameName, setGameName] = useState('');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const isJoined = currentUser ? match.joinedPlayers.includes(currentUser.uid) : false;

  const handleJoinClick = () => {
    if (!currentUser) {
      setView('auth');
      return;
    }
    if (currentUser.wallet < match.entryFee) {
      setShowInsufficientBalance(true);
      return;
    }
    setShowRegModal(true);
  };

  const handleFinalJoin = () => {
    if (!gameName.trim()) {
      alert('Please enter your Game Name');
      return;
    }
    // Slot number is now auto-assigned in App.tsx logic
    onJoin(match.id, gameName);
    setShowRegModal(false);
  };

  const handleShowRoomDetails = () => {
    if (!isJoined) {
      setShowAccessDenied(true);
    } else {
      setShowRoomModal(true);
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`${label} কপি করা হয়েছে!`);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const formatDateLong = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="animate-fadeIn min-h-screen bg-[#0f172a] flex flex-col font-sans">
      {/* Banner Header - Clickable if Live Link exists */}
      <div 
        className={`relative h-60 w-full ${match.liveLink ? 'cursor-pointer group' : ''}`}
        onClick={() => match.liveLink && window.open(match.liveLink, '_blank')}
      >
        <img 
          src={match.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"} 
          alt="Banner" 
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
        
        {match.liveLink && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                 <svg className="w-8 h-8 text-white fill-white" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
              </div>
           </div>
        )}

        <button 
          onClick={(e) => { e.stopPropagation(); onBack(); }} 
          className="absolute top-6 left-6 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-6">
           <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-1">{match.title}</h1>
           <div className="flex gap-2">
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase">{match.mode}</span>
              <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase border border-white/10">{match.map}</span>
           </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 pb-32">
        {/* Status Badge */}
        <div className="bg-[#1e293b] rounded-xl py-3 text-center border border-white/5 shadow-lg">
           <p className="text-[11px] font-bold text-slate-300 tracking-wide">
             Tournament Status: <span className="text-indigo-400">{match.isCancelled ? 'Cancelled' : 'Open For Registration'}</span>
           </p>
        </div>

        {/* Tournament Info Section */}
        <div className="bg-[#1e293b] rounded-2xl overflow-hidden border border-white/5 shadow-xl">
           <div className="bg-slate-700/30 px-5 py-3 border-b border-white/5">
              <h3 className="text-[12px] font-black text-slate-100 uppercase tracking-widest">Tournament Info</h3>
           </div>
           <div className="p-5 grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex items-start gap-3">
                 <div className="text-xl">📅</div>
                 <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5 tracking-tighter">Date & Time</p>
                    <p className="text-[10px] font-bold text-slate-200">{formatDateLong(match.startTime)}</p>
                    <p className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 mt-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                      {formatTime(match.startTime)}
                    </p>
                 </div>
              </div>
              <div className="flex items-start gap-3">
                 <div className="text-xl">🎮</div>
                 <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5 tracking-tighter">Game Mode</p>
                    <p className="text-[10px] font-bold text-slate-200 uppercase">{match.mode} MACH</p>
                    <p className="text-[10px] font-bold text-slate-400">{match.maxPlayers} Players Limit</p>
                 </div>
              </div>
              <div className="flex items-start gap-3">
                 <div className="text-xl">🪙</div>
                 <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5 tracking-tighter">Entry Fee</p>
                    <p className="text-[12px] font-black text-amber-500">৳ {match.entryFee} Coins</p>
                 </div>
              </div>
              <div className="flex items-start gap-3">
                 <div className="text-xl">💀</div>
                 <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5 tracking-tighter">Per Kill</p>
                    <p className="text-[12px] font-black text-red-500">৳ {match.perKill || 0} Coins</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Prize Pool Breakdown */}
        <div className="bg-[#1e293b] rounded-2xl overflow-hidden border border-white/5 shadow-xl">
           <div className="bg-slate-700/30 px-5 py-3 border-b border-white/5">
              <h3 className="text-[12px] font-black text-slate-100 uppercase tracking-widest">Prize Pool</h3>
           </div>
           <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="text-4xl">🏆</div>
                 <div>
                    <p className="text-3xl font-black text-white font-oswald leading-none">{match.prize} Coins</p>
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between text-[11px] font-bold py-1 border-b border-white/5">
                    <span className="text-slate-400">1st Place:</span>
                    <span className="text-amber-400">৳ {match.prize} coins</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Tournament Rules Section */}
        <div className="bg-[#1e293b] rounded-2xl overflow-hidden border border-white/5 shadow-xl">
           <div className="bg-slate-700/30 px-5 py-3 border-b border-white/5">
              <h3 className="text-[12px] font-black text-slate-100 uppercase tracking-widest">Tournament Rules</h3>
           </div>
           <div className="p-6 space-y-4 text-[11px] font-medium text-slate-200 leading-relaxed">
              <div className="space-y-3">
                 {match.detailedRules ? match.detailedRules : "সবাই রুলস পরে মেচে জয়েন করবেন। হ্যাকিং বা টিমিং নিষিদ্ধ।"}
              </div>
           </div>
        </div>

        {/* Participants Table */}
        <div className="bg-[#1e293b] rounded-2xl overflow-hidden border border-white/5 shadow-xl">
           <div className="bg-slate-700/30 px-5 py-3 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-[12px] font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
                 Participants ({match.joinedPlayers.length})
              </h3>
           </div>
           <div className="divide-y divide-white/5">
              {match.registrations && match.registrations.length > 0 ? (
                match.registrations.map((reg, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#161e2d]/40">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[11px] font-black border-2 border-[#1e293b]">
                          {idx + 1}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-100 uppercase">{reg.gameName}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-40">
                       <span className="text-lg">💀</span>
                       <span className="text-xs font-black text-slate-400">0</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-600 font-bold italic text-xs">No participants joined yet.</div>
              )}
           </div>
        </div>
      </div>

      {/* ACCESS DENIED MODAL */}
      {showAccessDenied && (
        <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
           <div className="bg-[#1e293b] w-full max-w-sm rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-white/10 flex flex-col items-center text-center animate-scale-in">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-600/20 rounded-full flex items-center justify-center border-4 border-red-600/30 animate-pulse mb-6 sm:mb-8">
                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-black">!</div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-100 mb-2 leading-tight">আপনি এই ম্যাচে জয়েন করেননি</h3>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 mb-8 sm:mb-10 leading-relaxed">রুম বিস্তারিত দেখার জন্য অনুগ্রহ করে প্রথমে ম্যাচে জয়েন করুন</p>
              <button onClick={() => setShowAccessDenied(false)} className="w-full py-4 sm:py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs sm:text-sm shadow-2xl active:scale-95 transition-all">বুঝেছি</button>
           </div>
        </div>
      )}

      {/* INSUFFICIENT BALANCE MODAL */}
      {showInsufficientBalance && (
        <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
           <div className="bg-[#1e293b] w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl border border-white/10 flex flex-col items-center text-center animate-scale-in">
              <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mb-6">
                 <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-6 bg-red-500 rounded-lg shadow-[0_4px_0_#991b1b]"></div>
                    <div className="w-10 h-6 bg-red-500 rounded-lg -mt-2 shadow-[0_4px_0_#991b1b]"></div>
                 </div>
              </div>
              <h3 className="text-2xl font-black text-slate-100 mb-2 leading-tight">Insufficient Balance</h3>
              <p className="text-xs font-bold text-slate-400 mb-10 leading-relaxed px-4">
                You need at least <span className="text-red-500">{match.entryFee} coins</span> to join this tournament. Please add funds to your account.
              </p>
              <div className="w-full flex gap-3">
                 <button 
                   onClick={() => setShowInsufficientBalance(false)}
                   className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl font-black uppercase text-xs"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={() => setView('wallet')}
                   className="flex-[1.5] py-4 bg-amber-500 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-amber-500/20"
                 >
                   + Add Money
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* ROOM DETAILS MODAL */}
      {showRoomModal && (
        <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
           <div className="bg-[#1e293b] w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl border border-white/10 flex flex-col items-center animate-scale-in relative">
              <button onClick={() => setShowRoomModal(false)} className="absolute top-6 right-6 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 text-3xl mt-10 mb-8">🔑</div>
              {match.roomId ? (
                <div className="w-full space-y-4">
                  <div onClick={() => copyText(match.roomId!, 'ID')} className="bg-[#161e2d] p-6 rounded-2xl border border-white/5 flex flex-col gap-1 items-center cursor-pointer active:scale-95 transition-all">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Room ID</span>
                    <span className="text-3xl font-black text-indigo-400 tracking-wider">{match.roomId}</span>
                  </div>
                  <div onClick={() => copyText(match.password!, 'Password')} className="bg-[#161e2d] p-6 rounded-2xl border border-white/5 flex flex-col gap-1 items-center cursor-pointer active:scale-95 transition-all">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</span>
                    <span className="text-3xl font-black text-indigo-400 tracking-wider">{match.password}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h4 className="text-base font-black text-white mb-2 uppercase">রুম আইডি এখনো দেওয়া হয়নি</h4>
                  <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase">ম্যাচ শুরুর ১০-১৫ মিনিট আগে দেওয়া হবে।</p>
                </div>
              )}
              <button onClick={() => setShowRoomModal(false)} className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs active:scale-95">বন্ধ করুন</button>
           </div>
        </div>
      )}

      {/* REGISTRATION MODAL - Simplified as requested */}
      {showRegModal && (
        <div className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
           <div className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-scale-in border border-white/10">
              <div className="flex items-center gap-5 mb-8">
                 <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 text-3xl">👤</div>
                 <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Tournament Entry</h2>
              </div>
              <p className="text-xs font-bold text-slate-400 mb-6 leading-relaxed">
                Please enter your Free Fire in-game name to register for this match.
              </p>
              <div className="space-y-6">
                 <div>
                    <label className="text-[11px] font-black uppercase text-slate-500 mb-2 block ml-1 tracking-widest">Your In-Game Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-5 flex items-center text-slate-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                      </div>
                      <input 
                        type="text"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        placeholder="ENTER PLAYER NAME"
                        className="w-full bg-[#161e2d] border border-white/5 rounded-2xl pl-14 pr-6 py-5 font-black text-white focus:border-indigo-500 outline-none shadow-inner uppercase"
                      />
                    </div>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setShowRegModal(false)} className="flex-1 py-5 font-black uppercase tracking-widest text-slate-500 text-[11px]">Cancel</button>
                    <button onClick={handleFinalJoin} className="flex-[2] blue-gradient text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 flex items-center justify-center gap-2">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                       Confirm Join
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* STICKY ACTION BUTTONS */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-5 bg-[#0f172a]/95 backdrop-blur-md border-t border-white/5 safe-bottom z-40 flex flex-col sm:flex-row gap-3 sm:gap-4">
         <button onClick={handleShowRoomDetails} className="w-full sm:flex-1 py-4 sm:py-4.5 bg-[#1e293b] text-indigo-400 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-[11px] border border-indigo-500/10 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shrink-0">
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
           Room Details
         </button>
         {!match.isCancelled && (
           <button 
             onClick={handleJoinClick}
             disabled={isJoined || match.joinedPlayers.length >= match.maxPlayers}
             className={`w-full sm:flex-1 py-4 sm:py-4.5 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-[11px] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 ${
               isJoined ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-default' : 'blue-gradient text-white'
             }`}
           >
             {isJoined ? "Joined ✓" : "Join Now"}
           </button>
         )}
      </div>
    </div>
  );
};

export default MatchDetails;
