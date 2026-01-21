
import React, { useState } from 'react';
import { Match, User, MatchStatus, Transaction, TransactionType, TransactionStatus } from '../types';

interface AdminWinnersProps {
  matches: Match[];
  users: User[];
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onCancelMatch: (id: string) => void;
}

const AdminWinners: React.FC<AdminWinnersProps> = ({ matches, users, setMatches, setUsers, onCancelMatch }) => {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  const handleSelectWinner = (matchId: string, userId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const user = users.find(u => u.uid === userId);
    if (!user) return;

    if (confirm(`Verify: Set ${user.email} as winner for ৳${match.prize}?`)) {
      // 1. Update User Wallet
      setUsers(prev => prev.map(u => 
        u.uid === userId ? { ...u, wallet: u.wallet + match.prize } : u
      ));

      // 2. Mark Match as Finished & Set Winner
      setMatches(prev => prev.map(m => 
        m.id === matchId ? { ...m, status: MatchStatus.FINISHED, winnerId: userId } : m
      ));

      alert('Victory confirmed! Prize credited to player wallet.');
      setSelectedMatch(null);
    }
  };

  const handleCancelClick = (matchId: string) => {
    if (confirm('Are you sure? This will cancel the match and automatically refund all entry fees to participants.')) {
      onCancelMatch(matchId);
      setSelectedMatch(null);
    }
  };

  const activeMatches = matches.filter(m => m.status !== MatchStatus.FINISHED);

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 px-1">
        <h2 className="text-2xl font-black text-slate-800 mb-1">Results Console</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Finalize Matches & Rewards</p>
      </div>

      <div className="space-y-4">
        {activeMatches.length > 0 ? (
          activeMatches.map(m => (
            <div key={m.id} className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
              <div className="p-5 sm:p-6 flex justify-between items-center">
                <div className="min-w-0">
                  <h4 className="font-black text-slate-800 text-xs sm:text-sm leading-tight uppercase tracking-tight mb-1 truncate mr-2">{m.title}</h4>
                  <p className="text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-widest">Prize: ৳{m.prize}</p>
                </div>
                <button 
                  onClick={() => setSelectedMatch(selectedMatch === m.id ? null : m.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                    selectedMatch === m.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  {selectedMatch === m.id ? 'Close' : 'Process'}
                </button>
              </div>
              
              {selectedMatch === m.id && (
                <div className="bg-slate-50 p-5 sm:p-6 border-t border-slate-100 animate-fadeIn space-y-5 sm:space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Joined Players ({m.joinedPlayers.length})</p>
                      <button 
                        onClick={() => handleCancelClick(m.id)}
                        className="text-[8px] sm:text-[9px] font-black text-red-500 uppercase tracking-widest underline"
                      >
                        Cancel Match
                      </button>
                    </div>
                    {m.joinedPlayers.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                        {m.joinedPlayers.map(uid => {
                          const user = users.find(u => u.uid === uid);
                          return (
                            <div key={uid} className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-black text-[9px] sm:text-[10px] shrink-0">
                                  {user?.email.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 truncate">{user?.email || 'Unknown'}</span>
                              </div>
                              <button 
                                onClick={() => handleSelectWinner(m.id, uid)}
                                className="bg-green-500 text-white text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-lg shadow-green-100 hover:bg-green-600 active:scale-95 transition-all shrink-0 ml-3"
                              >
                                Set Winner
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-xs text-slate-400 font-bold italic">No players joined yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-100">
             <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No active matches</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWinners;
