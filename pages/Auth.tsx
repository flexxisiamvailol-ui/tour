
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
  users: User[];
  setAdminMode?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, users, setAdminMode }) => {
  const [isLogin, setIsLogin] = useState(false); // Default to Register for new users
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [freeFireId, setFreeFireId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('elitezone_saved_email');
    const savedPass = localStorage.getItem('elitezone_saved_password');
    if (savedEmail && savedPass) {
      setEmail(savedEmail);
      setPassword(savedPass);
      setIsLogin(true); // Switch to login if we have saved data
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password.length < 4) {
      setError("Password must be at least 4 digits.");
      return;
    }

    if (!isLogin && freeFireId.length < 8) {
      setError("Please enter a valid FF UID.");
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      if (isLogin) {
        const foundUser = users.find(u => 
          (u.email.toLowerCase() === email.toLowerCase() || u.freeFireId === email) && 
          u.password === password
        );
        if (foundUser) {
          if (foundUser.isBanned) {
            setError("YOUR ACCOUNT HAS BEEN BANNED BY ADMIN.");
            setIsLoading(false);
            return;
          }
          
          // Save credentials if rememberMe is checked
          if (rememberMe) {
            localStorage.setItem('elitezone_saved_email', email);
            localStorage.setItem('elitezone_saved_password', password);
          } else {
            localStorage.removeItem('elitezone_saved_email');
            localStorage.removeItem('elitezone_saved_password');
          }

          onAuthSuccess(foundUser);
        } else {
          setError("Account not found. Check details or register.");
        }
      } else {
        const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          setError("Account already exists with this Email.");
        } else {
          const newUser: User = {
            uid: `u_${Math.random().toString(36).substr(2, 9)}`,
            email: email,
            password: password,
            wallet: 0,
            fullName: fullName || email.split('@')[0],
            freeFireId: freeFireId,
            createdAt: new Date().toISOString(),
            isBanned: false
          };

          // Save credentials for the new user automatically
          localStorage.setItem('elitezone_saved_email', email);
          localStorage.setItem('elitezone_saved_password', password);

          onAuthSuccess(newUser);
        }
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="animate-fadeIn px-3 sm:px-4 pt-6 sm:pt-8 min-h-[90vh] flex flex-col">
      <div className="mb-6 sm:mb-8 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 blue-gradient rounded-2xl sm:rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-200 rotate-12 transition-transform hover:rotate-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-white -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 tracking-tighter italic uppercase font-gaming">EliteZone</h1>
        <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">Join the Pro Arena</p>
      </div>

      <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 shadow-xl border border-slate-50 flex-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full -mr-12 -mt-12"></div>
        
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl sm:rounded-[1.75rem] mb-8 sm:mb-10 relative z-10">
          <button 
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'}`}
          >
            Register
          </button>
          <button 
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-[1.5rem] text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'}`}
          >
            Login
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-50 text-red-600 text-[8px] sm:text-[9px] font-black uppercase rounded-xl sm:rounded-2xl text-center border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 relative z-10">
          {!isLogin && (
            <div className="space-y-4 sm:space-y-5 animate-fadeIn">
              <div>
                <label className="block text-[9px] sm:text-[10px] uppercase font-black text-slate-400 mb-1.5 sm:mb-2 ml-1 tracking-widest">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter Name"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-slate-900 text-sm sm:text-base focus:outline-none focus:border-indigo-500 transition-all font-bold shadow-inner"
                />
              </div>
              <div>
                <label className="block text-[9px] sm:text-[10px] uppercase font-black text-slate-400 mb-1.5 sm:mb-2 ml-1 tracking-widest">Free Fire UID</label>
                <input
                  type="text"
                  required
                  value={freeFireId}
                  onChange={(e) => setFreeFireId(e.target.value)}
                  placeholder="123456789"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-slate-900 text-sm sm:text-base focus:outline-none focus:border-indigo-500 transition-all font-bold shadow-inner"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[9px] sm:text-[10px] uppercase font-black text-slate-400 mb-1.5 sm:mb-2 ml-1 tracking-widest">Email or Phone</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-slate-900 text-sm sm:text-base focus:outline-none focus:border-indigo-500 transition-all font-bold shadow-inner"
            />
          </div>
          <div>
            <label className="block text-[9px] sm:text-[10px] uppercase font-black text-slate-400 mb-1.5 sm:mb-2 ml-1 tracking-widest">Secret Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-slate-900 text-sm sm:text-base focus:outline-none focus:border-indigo-500 transition-all font-bold shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 px-1 mb-1 sm:mb-2">
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="remember" className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest cursor-pointer">Save Credentials</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full blue-gradient hover:opacity-90 text-white font-black py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] uppercase tracking-[0.2em] text-[10px] sm:text-[11px] shadow-2xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center min-h-[55px] sm:min-h-[64px]"
          >
            {isLoading ? (
              <div className="h-5 w-5 sm:h-6 sm:w-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              isLogin ? 'Unlock Portal' : 'Register & Enter'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
           <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">
             {isLogin ? "Don't have an account?" : "Already joined the elite?"}
             <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 ml-1.5 underline decoration-indigo-200">
               {isLogin ? 'Sign up here' : 'Sign in here'}
             </button>
           </p>
        </div>
      </div>

      <div className="mt-10 mb-8 flex flex-col items-center gap-4">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] opacity-40">256-BIT ENCRYPTION ACTIVE</p>
        {setAdminMode && (
          <button 
            onClick={setAdminMode}
            className="text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-400 transition-colors"
          >
            Staff Login Portal
          </button>
        )}
      </div>
    </div>
  );
};

export default Auth;
