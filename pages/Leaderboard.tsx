
import React, { useState } from 'react';
import { LEADERBOARD_DATA } from '../constants';

const Leaderboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'monthly' | 'all-time'>('monthly');
  const [metric, setMetric] = useState<'earnings' | 'wins'>('earnings');

  const top3 = LEADERBOARD_DATA.slice(0, 3);
  const others = LEADERBOARD_DATA.slice(3);

  return (
    <div className="animate-fadeIn">
      {/* Filters */}
      <div className="mb-10">
        <div className="flex gap-3 p-1.5 bg-slate-100 rounded-[1.5rem] mb-6 shadow-inner">
          <button 
            onClick={() => setTimeRange('monthly')}
            className={`flex-1 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === 'monthly' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setTimeRange('all-time')}
            className={`flex-1 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === 'all-time' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}
          >
            All Time
          </button>
        </div>

        <div className="flex gap-10 justify-center border-b border-slate-100">
           <button 
             onClick={() => setMetric('earnings')}
             className={`pb-3 text-xs font-black uppercase tracking-[0.2em] relative transition-colors ${metric === 'earnings' ? 'text-indigo-600' : 'text-slate-400'}`}
           >
             Earnings
             {metric === 'earnings' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full animate-fadeIn"></div>}
           </button>
           <button 
             onClick={() => setMetric('wins')}
             className={`pb-3 text-xs font-black uppercase tracking-[0.2em] relative transition-colors ${metric === 'wins' ? 'text-indigo-600' : 'text-slate-400'}`}
           >
             Wins
             {metric === 'wins' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full animate-fadeIn"></div>}
           </button>
        </div>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-2 sm:gap-4 mb-14 px-1 sm:px-2">
        {/* Rank 2 */}
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-[1.25rem] sm:rounded-[1.5rem] flex items-center justify-center text-2xl sm:text-3xl shadow-lg border-2 sm:border-4 border-white">
              {top3[1].avatar || '🎮'}
            </div>
            <div className="absolute -top-1.5 -right-1.5 bg-slate-400 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-black border-2 sm:border-4 border-white shadow-md">
              2
            </div>
          </div>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-600 truncate w-16 sm:w-20 text-center uppercase tracking-tighter mb-2">{top3[1].player}</p>
          <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] sm:text-xs font-black text-indigo-600 font-oswald">৳{top3[1].earnings}</p>
          </div>
        </div>

        {/* Rank 1 */}
        <div className="flex flex-col items-center transform -translate-y-4 sm:-translate-y-6">
          <div className="relative mb-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-50 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-4xl sm:text-5xl shadow-2xl border-2 sm:border-4 border-amber-200">
              {top3[0].avatar || '🎮'}
            </div>
            <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-amber-500 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black border-2 sm:border-4 border-white shadow-xl">
              1
            </div>
            <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl animate-bounce">👑</div>
          </div>
          <p className="text-[10px] sm:text-[11px] font-black text-slate-900 truncate w-24 sm:w-28 text-center uppercase tracking-tight mb-2">{top3[0].player}</p>
          <div className="bg-amber-500 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl shadow-amber-200">
            <p className="text-xs sm:text-sm font-black text-white font-oswald">৳{top3[0].earnings}</p>
          </div>
        </div>

        {/* Rank 3 */}
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-[1.25rem] sm:rounded-[1.5rem] flex items-center justify-center text-2xl sm:text-3xl shadow-lg border-2 sm:border-4 border-white">
              {top3[2].avatar || '🎮'}
            </div>
            <div className="absolute -top-1.5 -right-1.5 bg-amber-700 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-black border-2 sm:border-4 border-white shadow-md">
              3
            </div>
          </div>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-600 truncate w-16 sm:w-20 text-center uppercase tracking-tighter mb-2">{top3[2].player}</p>
          <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] sm:text-xs font-black text-indigo-600 font-oswald">৳{top3[2].earnings}</p>
          </div>
        </div>
      </div>

      {/* Others Ranking */}
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm mb-6">
        <div className="px-5 sm:px-8 py-4 border-b border-slate-50 flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
          <span>Rank • Player</span>
          <span>Total Earnings</span>
        </div>
        <div className="divide-y divide-slate-50">
          {others.map((entry) => (
            <div key={entry.rank} className="px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3 sm:gap-5">
                <span className="text-xs sm:text-sm font-black text-slate-300 w-5 sm:w-6 group-hover:text-indigo-400">#{entry.rank}</span>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-inner border border-white">
                  🎮
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-tight">{entry.player}</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{entry.matches} Matches</p>
                </div>
              </div>
              <p className="font-black text-slate-900 font-oswald text-base sm:text-lg">৳{entry.earnings}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-400 mt-8 mb-10 px-12 italic leading-relaxed">
        "Rankings update every 24 hours based on valid tournament results. Final decisions rest with EliteZone Admins."
      </p>
    </div>
  );
};

export default Leaderboard;
