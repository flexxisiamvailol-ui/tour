
import React, { useState, useEffect } from 'react';
import { Match, User, AppConfig, View, Category, Poster } from '../types';
import MatchCard from '../components/MatchCard';

interface HomeProps {
  appConfig: AppConfig;
  matches: Match[];
  onJoin: (id: string) => void;
  currentUser: User | null;
  onLoginRequest: () => void;
  users: User[];
  setView: (view: View) => void;
  onSelectMatch: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ appConfig, matches, onJoin, currentUser, onLoginRequest, users, setView, onSelectMatch }) => {
  const upcoming = matches.filter(m => m.status === 'upcoming');
  const [activeSlide, setActiveSlide] = useState(0);
  const posters = appConfig.posters && appConfig.posters.length > 0 ? appConfig.posters : [{ id: 'default', imageUrl: appConfig.homeBannerUrl, link: '#', ytLink: '' }];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % posters.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [posters.length]);

  const handleBannerClick = (poster: Poster) => {
    if (poster.ytLink) {
      window.open(poster.ytLink, '_blank');
    } else if (poster.link && poster.link !== '#') {
      window.open(poster.link, '_blank');
    }
  };

  const handleCategoryClick = (cat: Category) => {
    if (cat.link) {
      window.open(cat.link, '_blank');
    } else {
      setView('tournaments');
    }
  };

  return (
    <div className="animate-fadeIn pb-10 pt-0 bg-slate-50">
      {/* Welcome Message Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Welcome to</p>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">{appConfig.appName}</h1>
        </div>
        {!currentUser && (
          <button 
            onClick={onLoginRequest}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 flex items-center gap-2"
          >
            Login
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-6 0V6a3 3 0 016 0v1" />
            </svg>
          </button>
        )}
      </div>

      {/* Hero Banner Slider */}
      <div className="px-4">
        <div className="relative h-48 rounded-[2rem] overflow-hidden shadow-xl mb-6">
          <div className="w-full h-full flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
            {posters.map((poster) => (
              <div key={poster.id} className="min-w-full h-full relative cursor-pointer" onClick={() => handleBannerClick(poster)}>
                <img src={poster.imageUrl} alt="Slide" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4">
                  <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                     </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {posters.map((_, i) => (
              <div key={i} className={`h-1.5 transition-all rounded-full ${activeSlide === i ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        </div>

        {/* Live Promotion Banner - Clickable Poster */}
        {appConfig.liveBannerUrl && (
          <div 
            onClick={() => appConfig.liveBannerLink && window.open(appConfig.liveBannerLink, '_blank')}
            className="mb-8 relative h-32 rounded-[2rem] overflow-hidden shadow-2xl border-2 border-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer group"
          >
            <img src={appConfig.liveBannerUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Live Promo" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/60 to-transparent flex flex-col justify-center px-8">
               <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Now</span>
               </div>
               <h4 className="text-white font-black text-lg uppercase italic tracking-tighter leading-tight drop-shadow-lg">Watch Today's Match</h4>
               <p className="text-white/70 text-[9px] font-bold uppercase tracking-widest mt-1">Tap to stream on YouTube</p>
            </div>
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
               </svg>
            </div>
          </div>
        )}

        {/* Home Balance Card */}
        {appConfig.showHomeBalanceCard && (
          <div className="bg-white rounded-[2rem] p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Your Balance</p>
                <h3 className="text-xl font-black text-slate-800">৳{currentUser?.wallet || 0}</h3>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
               <button 
                 onClick={() => setView('wallet')}
                 className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-90"
               >
                 Add Coin
               </button>
               <button 
                 onClick={() => setView('wallet')}
                 className="flex-1 sm:flex-none bg-slate-50 text-indigo-600 px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-indigo-100 active:scale-90"
               >
                 Withdraw
               </button>
            </div>
          </div>
        )}

        {/* Match Categories Grid */}
        {appConfig.showHomeCategories && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5 px-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <h3 className="text-base font-black text-slate-800 tracking-tight uppercase">Match Categories</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(appConfig.categories || []).map((cat) => (
                <div 
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className="relative h-28 rounded-[1.75rem] overflow-hidden shadow-xl group active:scale-95 transition-all cursor-pointer border border-white/5"
                >
                  <img src={cat.bannerUrl} alt={cat.label} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b]/90 via-[#1e1b4b]/40 to-transparent"></div>
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <span className="text-[10px] font-black text-white leading-none uppercase tracking-tight mb-1">{cat.label}</span>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                       <span className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">
                          {matches.filter(m => m.mode === cat.label || m.mode === cat.label.replace('BR ', '').replace(' MACH', '')).length} Matches
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scrolling Notice Area */}
        {appConfig.liveAnnouncement && (
          <div className="bg-white py-3.5 px-4 rounded-2xl mb-8 flex items-center gap-3 border border-slate-100 shadow-sm overflow-hidden">
             <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
             </div>
             <div className="flex-1 whitespace-nowrap text-[10px] font-bold text-slate-500 uppercase tracking-widest overflow-hidden">
               <div className="inline-block animate-pulse">
                 {appConfig.liveAnnouncement}
               </div>
             </div>
          </div>
        )}

        {/* Active Tournaments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-black text-slate-800 tracking-tight uppercase italic">Upcoming Battles</h3>
            <button onClick={() => setView('tournaments')} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">View All</button>
          </div>
          {upcoming.slice(0, 3).map((match) => (
            <MatchCard 
              key={match.id} 
              match={match} 
              onJoin={onJoin} 
              currentUser={currentUser} 
              users={users}
              onClick={() => onSelectMatch(match.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Support FAB */}
      <button 
        onClick={() => window.open(appConfig.telegramSupportUrl, '_blank')}
        className="fixed bottom-28 right-6 w-14 h-14 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white z-[60] active:scale-90 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default Home;
