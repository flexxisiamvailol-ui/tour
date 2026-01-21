
import React, { useState } from 'react';
import { Match, User, MatchStatus, MatchCategory, AppConfig } from '../types';
import MatchCard from '../components/MatchCard';

interface TournamentsProps {
  matches: Match[];
  onJoin: (id: string) => void;
  currentUser: User | null;
  appConfig: AppConfig;
  users: User[];
  // Added missing onSelectMatch prop to match App.tsx usage
  onSelectMatch: (id: string) => void;
}

const Tournaments: React.FC<TournamentsProps> = ({ matches, onJoin, currentUser, appConfig, users, onSelectMatch }) => {
  const [statusTab, setStatusTab] = useState<MatchStatus | 'rules'>(MatchStatus.UPCOMING);
  const [categoryTab, setCategoryTab] = useState<MatchCategory>('all');

  const filtered = matches.filter(m => 
    m.status === statusTab && (categoryTab === 'all' || m.mode === categoryTab)
  );

  return (
    <div className="animate-fadeIn pb-10">
      {/* Primary Status Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[1.5rem] mb-6 shadow-inner overflow-x-auto no-scrollbar">
        {Object.values(MatchStatus).map((status) => (
          <button
            key={status}
            onClick={() => setStatusTab(status)}
            className={`flex-1 min-w-[80px] py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              statusTab === status ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'
            }`}
          >
            {status}
          </button>
        ))}
        <button
          onClick={() => setStatusTab('rules')}
          className={`flex-1 min-w-[80px] py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all ${
            statusTab === 'rules' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'
          }`}
        >
          Rules
        </button>
      </div>

      {statusTab === 'rules' ? (
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-sm animate-fadeIn">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-6 uppercase tracking-tight italic">Tournament Guidelines</h2>
          <div className="space-y-4">
            {appConfig.rules.split('\n').map((rule, idx) => (
              <div key={idx} className="flex gap-3 sm:gap-4 items-start">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-[9px] sm:text-[10px] font-black shrink-0 mt-0.5 shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Category Sub-Tabs */}
          <div className="flex gap-4 mb-8 px-2 overflow-x-auto no-scrollbar">
            {(['all', 'SOLO', 'DUO', 'SQUAD'] as MatchCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryTab(cat)}
                className={`whitespace-nowrap pb-2 text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors ${
                  categoryTab === cat ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                {cat}
                {categoryTab === cat && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full animate-fadeIn"></div>
                )}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="space-y-2">
            {filtered.length > 0 ? (
              filtered.map((match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onJoin={onJoin} 
                  currentUser={currentUser} 
                  users={users}
                  // Added onClick handler to trigger match selection
                  onClick={() => onSelectMatch(match.id)}
                />
              ))
            ) : (
              <div className="text-center py-24 opacity-60 flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1 italic">Arena is Empty</h3>
                <p className="text-xs font-bold text-slate-400">Check back later or try different filters.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Tournaments;
