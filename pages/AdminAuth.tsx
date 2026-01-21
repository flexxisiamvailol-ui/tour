
import React, { useState } from 'react';
import { User } from '../types';

interface AdminAuthProps {
  onLogin: (id: string) => void;
  users: User[];
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onLogin, users }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Master Credentials
    const MASTER_ID = '@admin11';
    const VAULT_KEY = 'rexv7n@77';

    setTimeout(() => {
      // Check for Master Login
      if (adminId.trim() === MASTER_ID && password.trim() === VAULT_KEY) {
        onLogin(adminId);
        setLoading(false);
        return;
      }

      // Check for App Admin Accounts
      const foundAdmin = users.find(u => 
        u.isAdmin && 
        (u.email.toLowerCase() === adminId.toLowerCase() || u.freeFireId === adminId) && 
        u.password === password
      );

      if (foundAdmin) {
        onLogin(foundAdmin.email);
      } else {
        setError('ACCESS DENIED: SECURE HANDSHAKE FAILED');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fadeIn px-2">
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-4xl text-white font-extrabold shadow-2xl mx-auto mb-6 border-4 border-white"><span className="font-gaming">AD</span></div>
        <h1 className="text-2xl font-extrabold text-slate-800 uppercase tracking-tighter mb-1 font-gaming">Staff Portal</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Authorized Only</p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-soft border border-slate-100 w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {error && <div className="bg-red-50 text-red-500 text-[8px] sm:text-[9px] font-black uppercase tracking-widest p-3 sm:p-4 rounded-xl sm:rounded-2xl text-center border border-red-100 animate-pulse">{error}</div>}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-[9px] sm:text-[10px] uppercase font-extrabold text-slate-400 ml-1 tracking-widest">Admin ID</label>
            <input type="text" required value={adminId} onChange={e => setAdminId(e.target.value)} placeholder="@admin11" className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-slate-900 text-xs sm:text-sm focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold" />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-[9px] sm:text-[10px] uppercase font-extrabold text-slate-400 ml-1 tracking-widest">Secret Key</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-slate-900 text-xs sm:text-sm focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold" />
          </div>
          <button type="submit" disabled={loading} className="w-full blue-gradient text-white font-extrabold py-4 sm:py-5 rounded-2xl sm:rounded-3xl uppercase tracking-[0.2em] text-[10px] sm:text-[11px] shadow-xl active:scale-95 transition-all flex items-center justify-center min-h-[55px] sm:min-h-[60px]">
            {loading ? <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div> : "Access Console"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;
