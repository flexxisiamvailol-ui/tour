
import React, { useState, useEffect, useCallback } from 'react';
import { Poster, AppConfig } from '../types';

interface PosterSliderProps {
  posters: Poster[];
  onFinish: () => void;
  config: AppConfig;
}

const PosterSlider: React.FC<PosterSliderProps> = ({ posters, onFinish, config }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % posters.length);
  }, [posters.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  if (posters.length === 0) {
    onFinish();
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1100] bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Top Branding Section */}
      <div className="absolute top-8 sm:top-12 left-0 right-0 flex flex-col items-center animate-fadeIn [animation-delay:200ms] opacity-0">
        {config.isSliderLogoEnabled && (
          <img 
            src={config.appLogoUrl} 
            alt="App Logo" 
            style={{ width: config.sliderLogoSize }} 
            className="object-contain mb-2 sm:mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        )}
        {config.isSliderAppNameEnabled && (
          <h1 className="text-white text-base sm:text-lg font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] italic font-gaming">
            {config.appName}
          </h1>
        )}
      </div>

      <div className="w-full max-w-[280px] sm:max-w-sm relative aspect-[4/5] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 bg-slate-900 group">
        {posters.map((poster, index) => (
          <div
            key={poster.id}
            onClick={() => window.open(poster.link, '_blank')}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out cursor-pointer ${
              index === currentIndex 
                ? 'opacity-100 scale-100 translate-x-0' 
                : 'opacity-0 scale-95 translate-x-8 pointer-events-none'
            }`}
          >
            <img 
              src={poster.imageUrl} 
              alt={`Featured ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
        
        {/* Indicators */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2.5 z-20">
          {posters.map((_, index) => (
            <button
              key={index}
              onClick={() => { setCurrentIndex(index); setIsPaused(true); }}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                index === currentIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 sm:mt-12 w-full max-w-sm px-4 flex flex-col gap-3 sm:gap-4 items-center">
        <h2 className="text-white text-lg sm:text-xl font-black italic uppercase tracking-tighter text-center">
          Featured Highlights
        </h2>
        <p className="text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-center leading-relaxed">
          Watch gameplay tutorials and winning strategies to dominate the arena.
        </p>

        <button 
          onClick={onFinish}
          className="mt-4 sm:mt-6 w-full py-4 sm:py-5 bg-white text-black font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] rounded-[1.5rem] sm:rounded-[2rem] shadow-xl active:scale-95 transition-all"
        >
          Enter the Hub
        </button>
      </div>
    </div>
  );
};

export default PosterSlider;
