
import React, { useState } from 'react';
import { Match, MatchStatus } from '../types';

interface AdminMatchesProps {
  matches: Match[];
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  onCancelMatch: (id: string) => void;
}

const AdminMatches: React.FC<AdminMatchesProps> = ({ matches, setMatches, onCancelMatch }) => {
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this match record? This is permanent.')) {
      setMatches(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleCancelClick = (m: Match) => {
    if (confirm(`Cancel "${m.title}"? This will refund all ${m.joinedPlayers.length} participants automatically.`)) {
      onCancelMatch(m.id);
    }
  };

  const handleUpdateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;
    
    setMatches(prev => prev.map(m => m.id === editingMatch.id ? editingMatch : m));
    setEditingMatch(null);
    alert('Match updated successfully on the cloud!');
  };

  const GAME_MODES = ['BR SOLO', 'BR DUO', 'BR SQUAD', 'CLASH SQUAD', 'LONE WOLF'];
  const MAPS = ['Bermuda', 'Purgatory', 'Kalahari', 'Nexterra'];

  const activeMatches = matches.filter(m => m.status !== MatchStatus.FINISHED);
  const finishedMatches = matches.filter(m => m.status === MatchStatus.FINISHED);

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Live Operations</h2>
      </div>

      {editingMatch && (
        <div className="fixed inset-0 z-[250] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4 overflow-y-auto py-10">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl space-y-5 animate-fadeIn my-auto border border-white/20">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic border-b border-slate-100 pb-3">Edit Battle Protocol</h3>
            <form onSubmit={handleUpdateMatch} className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-1">Match Title</label>
                <input 
                  value={editingMatch.title}
                  onChange={e => setEditingMatch({...editingMatch, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold shadow-sm outline-none focus:ring-2 ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Game Mode</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-[10px] font-black uppercase outline-none"
                    value={editingMatch.mode}
                    onChange={e => setEditingMatch({...editingMatch, mode: e.target.value})}
                  >
                    {GAME_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Map</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-[10px] font-black uppercase outline-none"
                    value={editingMatch.map}
                    onChange={e => setEditingMatch({...editingMatch, map: e.target.value})}
                  >
                    {MAPS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-1">Room ID</label>
                  <input 
                    value={editingMatch.roomId || ''}
                    onChange={e => setEditingMatch({...editingMatch, roomId: e.target.value})}
                    placeholder="Auto-filled"
                    className="w-full bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-xs font-black tracking-wider shadow-sm outline-none focus:ring-2 ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-1">Password</label>
                  <input 
                    value={editingMatch.password || ''}
                    onChange={e => setEditingMatch({...editingMatch, password: e.target.value})}
                    placeholder="Pass"
                    className="w-full bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-xs font-black tracking-wider shadow-sm outline-none focus:ring-2 ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-1">Start Time</label>
                  <input 
                    type="datetime-local"
                    value={editingMatch.startTime.slice(0, 16)}
                    onChange={e => setEditingMatch({...editingMatch, startTime: new Date(e.target.value).toISOString()})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-[10px] font-bold shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-1">Max Players</label>
                  <input 
                    type="number"
                    value={editingMatch.maxPlayers}
                    onChange={e => setEditingMatch({...editingMatch, maxPlayers: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest block mb-1">Entry Fee</label>
                  <input 
                    type="number"
                    value={editingMatch.entryFee}
                    onChange={e => setEditingMatch({...editingMatch, entryFee: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2 py-3 text-xs font-bold shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest block mb-1">1st Prize</label>
                  <input 
                    type="number"
                    value={editingMatch.prize}
                    onChange={e => setEditingMatch({...editingMatch, prize: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2 py-3 text-xs font-bold shadow-sm"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest block mb-1">💀 Per Kill</label>
                  <input 
                    type="number"
                    value={editingMatch.perKill}
                    onChange={e => setEditingMatch({...editingMatch, perKill: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2 py-3 text-xs font-bold shadow-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-1">YouTube Live Link</label>
                <input 
                  value={editingMatch.liveLink || ''}
                  onChange={e => setEditingMatch({...editingMatch, liveLink: e.target.value})}
                  placeholder="https://youtube.com/live/..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[10px] font-bold shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-1">Banner Image URL</label>
                <input 
                  value={editingMatch.imageUrl || ''}
                  onChange={e => setEditingMatch({...editingMatch, imageUrl: e.target.value})}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[10px] font-bold shadow-sm outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-1">Detailed Rules (Bengali/English)</label>
                <textarea 
                  value={editingMatch.detailedRules || ''}
                  onChange={e => setEditingMatch({...editingMatch, detailedRules: e.target.value})}
                  placeholder="ম্যাচের বিস্তারিত নিয়মাবলি এখানে লিখুন..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[10px] font-bold shadow-sm outline-none h-24 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4 pb-2">
                <button type="submit" className="flex-1 blue-gradient text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg tracking-widest active:scale-95 transition-all">Update Cloud</button>
                <button type="button" onClick={() => setEditingMatch(null)} className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black uppercase text-[10px] border border-slate-200">Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Active Section */}
        <div className="space-y-4">
           <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">Live & Upcoming Matches</p>
           {activeMatches.map(m => (
            <div 
              key={m.id} 
              onClick={() => setEditingMatch(m)}
              className="bg-white p-5 rounded-[2.5rem] border border-slate-100 flex justify-between items-center shadow-soft group hover:border-indigo-200 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xs border border-indigo-100">
                    {m.mode.charAt(0)}
                 </div>
                 <div>
                   <h4 className="font-black text-sm text-slate-800 mb-1 uppercase tracking-tight">{m.title}</h4>
                   <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{m.mode} • ৳{m.entryFee} • 💀 ৳{m.perKill || 0}</p>
                   <div className="mt-2 flex gap-2">
                      <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-black tracking-tighter">{m.joinedPlayers.length}/{m.maxPlayers} Joined</span>
                   </div>
                 </div>
              </div>
              <div className="flex gap-2">
                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                   </svg>
                 </div>
                 <button 
                   onClick={(e) => { e.stopPropagation(); handleCancelClick(m); }}
                   className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 transition-all"
                   title="Cancel & Refund"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* Finished Section */}
        {finishedMatches.length > 0 && (
          <div className="space-y-4">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Historical Records</p>
             {finishedMatches.map(m => (
              <div key={m.id} className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 flex justify-between items-center opacity-60">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs">
                      {m.mode.charAt(0)}
                   </div>
                   <div>
                     <h4 className="font-black text-xs text-slate-500 uppercase tracking-tight">{m.title}</h4>
                     <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${m.isCancelled ? 'bg-red-100 text-red-500' : 'bg-slate-200 text-slate-600'}`}>
                        {m.isCancelled ? 'CANCELLED' : 'FINISHED'}
                     </span>
                   </div>
                </div>
                <button 
                   onClick={() => handleDelete(m.id)}
                   className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
                 </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMatches;
