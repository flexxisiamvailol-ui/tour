
import React, { useState } from 'react';
import { AdminView, Match, MatchStatus } from '../types';

interface AdminDashboardProps {
  stats: { users: number, matches: number, pendingTx: number };
  setView: (view: AdminView) => void;
  onAddMatch: (match: Match) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, setView, onAddMatch }) => {
  const [activeModal, setActiveModal] = useState<'match' | null>(null);
  const [matchForm, setMatchForm] = useState({
    title: '',
    fee: '10',
    prize: '400',
    perKill: '5',
    type: 'BR DUO',
    map: 'Bermuda',
    slots: '48',
    imageUrl: '',
    liveLink: '',
    rules: 'সবাই রুলস পরে মেচে জয়েন করবেন',
    roomId: '',
    password: '',
    startTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16)
  });

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const match: Match = {
      id: `m_${Date.now()}`,
      title: matchForm.title,
      entryFee: parseInt(matchForm.fee),
      prize: parseInt(matchForm.prize),
      perKill: parseInt(matchForm.perKill),
      status: MatchStatus.UPCOMING,
      joinedPlayers: [],
      registrations: [],
      maxPlayers: parseInt(matchForm.slots),
      startTime: new Date(matchForm.startTime).toISOString(),
      map: matchForm.map,
      mode: matchForm.type,
      imageUrl: matchForm.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
      liveLink: matchForm.liveLink || undefined,
      detailedRules: matchForm.rules,
      roomId: matchForm.roomId || undefined,
      password: matchForm.password || undefined
    };
    onAddMatch(match);
    setActiveModal(null);
    alert('Match Published Successfully!');
    // Reset form
    setMatchForm({
      title: '',
      fee: '10',
      prize: '400',
      perKill: '5',
      type: 'BR DUO',
      map: 'Bermuda',
      slots: '48',
      imageUrl: '',
      liveLink: '',
      rules: 'সবাই রুলস পরে মেচে জয়েন করবেন',
      roomId: '',
      password: '',
      startTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16)
    });
  };

  const GAME_MODES = ['BR SOLO', 'BR DUO', 'BR SQUAD', 'CLASH SQUAD', 'LONE WOLF'];
  const MAPS = ['Bermuda', 'Purgatory', 'Kalahari', 'Nexterra'];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none mb-1 font-gaming italic">Console v2.5 🛠️</h2>
        <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Control center for EliteZone.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div 
          onClick={() => setView('users')}
          className="blue-gradient p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group cursor-pointer active:scale-95 transition-all"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <p className="text-4xl sm:text-5xl font-extrabold mb-1 tracking-tighter relative z-10">{stats.users}</p>
          <p className="text-[10px] font-black opacity-80 uppercase tracking-[0.2em] relative z-10">Total Players</p>
        </div>
        <div 
          onClick={() => setView('matches')}
          className="bg-gradient-to-br from-emerald-400 to-teal-600 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl shadow-emerald relative overflow-hidden group cursor-pointer active:scale-95 transition-all"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <p className="text-4xl sm:text-5xl font-extrabold mb-1 tracking-tighter relative z-10">{stats.matches}</p>
          <p className="text-[10px] font-black opacity-80 uppercase tracking-[0.2em] relative z-10">Active Matches</p>
        </div>
      </div>

      <div className="mb-6 px-1 flex items-center gap-3">
        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight font-gaming uppercase italic">Management</h3>
        <div className="h-0.5 flex-1 bg-slate-100 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button onClick={() => setActiveModal('match')} className="bg-white p-5 sm:p-7 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center gap-3 sm:gap-4 shadow-soft active:scale-95 transition-all group">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-sky-500 shadow-sm border border-sky-100 transition-all group-hover:bg-sky-500 group-hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </div>
          <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest sm:tracking-[0.2em]">New Match</span>
        </button>

        <button onClick={() => setView('winners')} className="bg-white p-5 sm:p-7 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center gap-3 sm:gap-4 shadow-soft active:scale-95 transition-all group">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100 transition-all group-hover:bg-emerald-500 group-hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest sm:tracking-[0.2em]">Results</span>
        </button>

        <button onClick={() => setView('transactions')} className="bg-white p-5 sm:p-7 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center gap-3 sm:gap-4 shadow-soft active:scale-95 transition-all group">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100 transition-all group-hover:bg-indigo-600 group-hover:text-white relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {stats.pendingTx > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[7px] sm:text-[8px] font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">{stats.pendingTx}</span>}
          </div>
          <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest sm:tracking-[0.2em]">Payments</span>
        </button>

        <button onClick={() => setView('users')} className="bg-white p-5 sm:p-7 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center gap-3 sm:gap-4 shadow-soft active:scale-95 transition-all group">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-pink-500 shadow-sm border border-pink-100 transition-all group-hover:bg-pink-500 group-hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <span className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest sm:tracking-[0.2em]">Users</span>
        </button>
      </div>

      {activeModal === 'match' && (
        <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn overflow-y-auto">
          <div className="bg-slate-50 w-full max-w-sm rounded-[3rem] p-8 shadow-2xl space-y-6 relative overflow-hidden my-auto border border-white">
            <div className="absolute top-0 left-0 w-full h-1.5 blue-gradient"></div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight font-gaming italic border-b border-slate-200 pb-3">New Battle Entry</h3>
            <form onSubmit={handleCreateMatch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Title</label>
                <input placeholder="e.g. Solo King #42" className="w-full bg-white border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-bold shadow-sm outline-none focus:ring-2 ring-indigo-500" value={matchForm.title} onChange={e => setMatchForm({...matchForm, title: e.target.value})} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Mode</label>
                  <select className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-black uppercase outline-none" value={matchForm.type} onChange={e => setMatchForm({...matchForm, type: e.target.value})}>
                    {GAME_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Map</label>
                  <select className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-black uppercase outline-none" value={matchForm.map} onChange={e => setMatchForm({...matchForm, map: e.target.value})}>
                    {MAPS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Start Time</label>
                <input type="datetime-local" value={matchForm.startTime} onChange={e => setMatchForm({...matchForm, startTime: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-bold shadow-sm outline-none focus:ring-2 ring-indigo-500" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Room ID</label>
                  <input placeholder="Auto-filled later" className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold shadow-sm outline-none" value={matchForm.roomId} onChange={e => setMatchForm({...matchForm, roomId: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
                  <input placeholder="1234" className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold shadow-sm outline-none" value={matchForm.password} onChange={e => setMatchForm({...matchForm, password: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5"><label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">Fee</label><input type="number" value={matchForm.fee} onChange={e => setMatchForm({...matchForm, fee: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-black outline-none" /></div>
                <div className="space-y-1.5"><label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">1st Prize</label><input type="number" value={matchForm.prize} onChange={e => setMatchForm({...matchForm, prize: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-black outline-none" /></div>
                <div className="col-span-2 sm:col-span-1 space-y-1.5"><label className="text-[8px] font-black uppercase text-slate-400 tracking-widest ml-1">💀 Per Kill</label><input type="number" value={matchForm.perKill} onChange={e => setMatchForm({...matchForm, perKill: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-black outline-none" /></div>
              </div>
              
              {/* NEW FIELDS: Banner URL and Live Link */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Match Banner Image URL</label>
                  <input 
                    placeholder="https://images..." 
                    className="w-full bg-white border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-bold shadow-sm outline-none focus:ring-2 ring-indigo-500" 
                    value={matchForm.imageUrl} 
                    onChange={e => setMatchForm({...matchForm, imageUrl: e.target.value})} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">YouTube Live Link</label>
                  <input 
                    placeholder="https://youtube.com/live/..." 
                    className="w-full bg-white border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-bold shadow-sm outline-none focus:ring-2 ring-indigo-500" 
                    value={matchForm.liveLink} 
                    onChange={e => setMatchForm({...matchForm, liveLink: e.target.value})} 
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-4 font-black uppercase text-slate-400 text-[10px] tracking-widest">Discard</button>
                <button type="submit" className="flex-1 blue-gradient text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg tracking-widest">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
