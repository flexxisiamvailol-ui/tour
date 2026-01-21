
import React, { useState, useEffect } from 'react';
import { AppConfig } from '../types';

interface SplashScreenProps {
  logoUrl?: string;
  config: AppConfig;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ logoUrl, config }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 2;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#0F172A] flex flex-col items-center justify-center overflow-hidden p-6 sm:p-8">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

      <div className="flex flex-col items-center relative z-10 w-full max-w-[280px] sm:max-w-xs">
        <div className="animate-scale-in mb-8 sm:mb-12">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              onError={(e) => {
                 (e.target as any).src = 'https://cdn-icons-png.flaticon.com/512/3665/3665923.png';
              }}
            />
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-indigo-600 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center text-3xl sm:text-4xl text-white font-black shadow-2xl">
              E
            </div>
          )}
        </div>

        <div className="w-full space-y-3 sm:space-y-4">
          <div className="flex justify-between items-end mb-1">
             <p className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] animate-pulse">
               {config.loadingText || 'Loading assets...'}
             </p>
             <p className="text-xs sm:text-sm font-black text-white italic">{Math.min(progress, 100)}%</p>
          </div>
          
          <div className="h-1.5 sm:h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
             <div 
               className="h-full bg-indigo-600 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.8)]" 
               style={{ width: `${Math.min(progress, 100)}%` }}
             ></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 text-center opacity-40">
        <p className="text-[9px] font-black text-white uppercase tracking-[0.5em]">{config.appName} v2.5.0</p>
      </div>
    </div>
  );
};

export default SplashScreen;
