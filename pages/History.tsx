
import React, { useState } from 'react';
import { Match, Transaction, User, TransactionStatus, TransactionType, MatchStatus } from '../types';

interface HistoryProps {
  matches: Match[];
  transactions: Transaction[];
  currentUser: User;
}

const History: React.FC<HistoryProps> = ({ matches, transactions, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'wallet'>('matches');

  const joinedMatches = matches.filter(m => m.joinedPlayers.includes(currentUser.uid));
  
  const walletHistory = transactions.filter(t => t.userId === currentUser.uid).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="animate-fadeIn pb-12">
      {/* Overall Statistics Header */}
      <div className="bg-[#1e1b4b] rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 text-white shadow-xl shadow-indigo-100 mb-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
         <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter mb-1 font-gaming">Overall Statistics</h2>
         <p className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 sm:mb-8">আপনার সম্পূর্ণ টুর্নামেন্ট সারসংক্ষেপ</p>
         
         <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 text-center">
               <span className="text-base sm:text-lg block mb-1">🎮</span>
               <p className="text-lg sm:text-xl font-black font-oswald">{joinedMatches.length}</p>
               <p className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-tighter">Total Matches</p>
            </div>
            <div className="bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 text-center">
               <span className="text-base sm:text-lg block mb-1">💀</span>
               <p className="text-lg sm:text-xl font-black font-oswald">0</p>
               <p className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-tighter">Total Kills</p>
            </div>
            <div className="bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 text-center">
               <span className="text-base sm:text-lg block mb-1">৳</span>
               <p className="text-lg sm:text-xl font-black font-oswald">0</p>
               <p className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-tighter">Total Earned</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm mb-10">
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
           <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest italic">Tournament History</h3>
           </div>
           <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={() => setActiveTab('matches')} className={`flex-1 sm:flex-none px-4 py-2.5 sm:py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === 'matches' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>Matches</button>
              <button onClick={() => setActiveTab('wallet')} className={`flex-1 sm:flex-none px-4 py-2.5 sm:py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === 'wallet' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>Wallet</button>
           </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          {activeTab === 'matches' ? (
            <div className="divide-y divide-slate-50">
              {joinedMatches.length > 0 ? (
                joinedMatches.map((m) => (
                  <div key={m.id} className="p-5 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-[9px] sm:text-[10px] font-black border border-indigo-100 shrink-0">{m.id.toUpperCase().slice(-4)}</div>
                       <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-tight truncate">{m.title}</h4>
                          <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase mt-0.5 sm:mt-1">{new Date(m.startTime).toLocaleDateString()} • {new Date(m.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                       </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                       <div className="flex items-center gap-1 sm:gap-1.5 mb-1 justify-end">
                          <span className="text-base sm:text-lg">💀</span>
                          <span className="text-sm font-black text-slate-800">0</span>
                       </div>
                       <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Kills Counted</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-slate-300 font-bold italic uppercase text-xs">No match records found</div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
               {walletHistory.length > 0 ? (
                 walletHistory.map((t) => (
                    <div key={t.id} className="p-6 hover:bg-slate-50 transition-colors">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${t.metadata?.method === 'bKash' ? 'bg-[#e2136e]' : t.metadata?.method === 'Nagad' ? 'bg-[#f6921e]' : 'bg-indigo-600'}`}>
                                {t.metadata?.method === 'bKash' ? 'b' : t.metadata?.method === 'Nagad' ? 'n' : '৳'}
                             </div>
                             <div>
                                <h4 className="text-sm font-black text-slate-800 uppercase">{t.metadata?.method || t.type.replace('_', ' ')}</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{t.metadata?.phoneNumber || 'System Record'}</p>
                             </div>
                          </div>
                          <div className="flex flex-col items-end">
                             <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full mb-1 ${
                               t.status === TransactionStatus.PENDING ? 'bg-amber-100 text-amber-500' :
                               t.status === TransactionStatus.APPROVED ? 'bg-green-100 text-green-500' :
                               'bg-red-100 text-red-500'
                             }`}>
                                {t.status === TransactionStatus.APPROVED ? '● Completed' : t.status}
                             </span>
                             <p className={`text-lg font-black font-oswald ${[TransactionType.DEPOSIT, TransactionType.WINNING, TransactionType.REFUND].includes(t.type) ? 'text-green-600' : 'text-red-500'}`}>
                                {t.amount} Tk
                             </p>
                          </div>
                       </div>
                       <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-300 tracking-[0.2em]">
                          <span>ID: {t.metadata?.trxId || t.id.slice(-8)}</span>
                          <span>{new Date(t.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                       </div>
                    </div>
                 ))
               ) : (
                 <div className="py-20 text-center text-slate-300 font-bold italic uppercase text-xs">No transactions found</div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
