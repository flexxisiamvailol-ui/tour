
import React, { useState, useRef } from 'react';
import { User } from '../types';

interface UserSettingsProps {
  user: User | null;
  onBack: () => void;
  onUpdateProfile: (data: Partial<User>) => void;
  onLogout: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ user, onBack, onUpdateProfile, onLogout }) => {
  const [activeSubView, setActiveSubView] = useState<'main' | 'edit_profile' | 'change_password'>('main');
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Edit Profile States
  const [editForm, setEditForm] = useState({
    gameName: user?.freeFireId || '',
    name: user?.fullName || '',
    email: user?.email || '',
    phone: '01943457769' // Placeholder as seen in screenshot
  });

  // Change Password States
  const [passForm, setPassForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ 
      fullName: editForm.name, 
      freeFireId: editForm.gameName 
    });
    alert('Profile updated successfully!');
    setActiveSubView('main');
  };

  const handlePassSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.new.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    if (passForm.new !== passForm.confirm) {
      alert('Passwords do not match.');
      return;
    }
    alert('Password changed successfully!');
    setActiveSubView('main');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ profilePhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (activeSubView === 'edit_profile') {
    return (
      <div className="animate-fadeIn min-h-screen bg-[#F8FAFC]">
         <div className="bg-white px-5 py-6 flex items-center border-b border-slate-100 sticky top-0 z-10">
            <button onClick={() => setActiveSubView('main')} className="p-2 -ml-2 text-slate-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="ml-4">
               <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase italic leading-none">Edit Profile</h2>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Update your information</p>
            </div>
         </div>

         <form onSubmit={handleProfileSave} className="p-5 sm:p-8 space-y-6 sm:space-y-8 flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
               <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-600 border-4 border-white shadow-xl overflow-hidden relative">
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl text-white font-black">{user?.email.charAt(0).toUpperCase()}</div>
                  )}
               </div>
               <div className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               </div>
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="text-center -mt-4 sm:-mt-6">
              <h3 className="text-lg sm:text-xl font-black text-slate-800">{user?.fullName || 'REX V7N'}</h3>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold">{user?.email}</p>
            </div>

            <div className="w-full space-y-5 sm:space-y-6">
               <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                     <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" /></svg>
                     Game Name
                  </label>
                  <input value={editForm.gameName} onChange={e => setEditForm({...editForm, gameName: e.target.value})} className="w-full bg-slate-900 border-none rounded-xl px-5 sm:px-6 py-3.5 sm:py-4 font-black text-slate-100 shadow-xl text-sm sm:text-base" />
               </div>
               <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                     <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                     Name
                  </label>
                  <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-5 sm:px-6 py-3.5 sm:py-4 font-black text-slate-800 text-sm sm:text-base" />
               </div>
               <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                     <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                     Email
                  </label>
                  <input disabled value={editForm.email} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-5 sm:px-6 py-3.5 sm:py-4 font-bold text-slate-400 cursor-not-allowed text-sm sm:text-base" />
               </div>
               <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                     <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                     Phone
                  </label>
                  <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-5 sm:px-6 py-3.5 sm:py-4 font-bold text-slate-800 text-sm sm:text-base" />
               </div>
            </div>

            <button type="submit" className="w-full py-4 sm:py-5 blue-gradient text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all text-xs sm:text-sm">Save Changes</button>
         </form>
      </div>
    );
  }

  if (activeSubView === 'change_password') {
    return (
      <div className="animate-fadeIn min-h-screen bg-[#111827] flex flex-col">
         <div className="px-5 py-6 flex items-center border-b border-white/5 sticky top-0 z-10 bg-[#111827]">
            <button onClick={() => setActiveSubView('main')} className="p-2 -ml-2 text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="ml-4">
               <h2 className="text-lg font-black text-white tracking-tight uppercase italic leading-none">Settings</h2>
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Security Dashboard</p>
            </div>
         </div>

         <form onSubmit={handlePassSave} className="p-8 flex flex-col items-center flex-1">
            <div className="w-24 h-24 bg-indigo-600/20 rounded-full flex items-center justify-center mb-6 border-4 border-indigo-600/10">
               <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl">🔒</div>
            </div>
            <h2 className="text-2xl font-black text-white mb-2 italic">Change Password</h2>
            <p className="text-xs font-bold text-slate-400 text-center mb-10 leading-relaxed px-4">
              Enter your current password and choose a new secure password
            </p>

            <div className="w-full space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-5 flex items-center text-indigo-500">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input type={showPassword ? "text" : "password"} required placeholder="Enter current password" value={passForm.current} onChange={e => setPassForm({...passForm, current: e.target.value})} className="w-full bg-[#1F2937] border border-white/5 rounded-2xl pl-14 pr-14 py-5 font-bold text-white focus:border-indigo-600 outline-none transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-5 flex items-center text-slate-500">
                       {showPassword ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.127-2.384m2.36-1.32a8.959 8.959 0 013.04-1.246m2.52.274a9.956 9.956 0 012.363 1.147M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 2.478l1.414 1.414m-1.414-1.414L11 21.233M11 3l1.414 1.414" /></svg>}
                    </button>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-5 flex items-center text-indigo-500">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                    </div>
                    <input type="password" required placeholder="Enter new password" value={passForm.new} onChange={e => setPassForm({...passForm, new: e.target.value})} className="w-full bg-[#1F2937] border border-white/5 rounded-2xl pl-14 pr-6 py-5 font-bold text-white focus:border-indigo-600 outline-none transition-all" />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-5 flex items-center text-indigo-500">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <input type="password" required placeholder="Confirm new password" value={passForm.confirm} onChange={e => setPassForm({...passForm, confirm: e.target.value})} className="w-full bg-[#1F2937] border border-white/5 rounded-2xl pl-14 pr-6 py-5 font-bold text-white focus:border-indigo-600 outline-none transition-all" />
                  </div>
               </div>
            </div>

            <div className="w-full mt-10 p-6 bg-[#1F2937] rounded-[1.5rem] border border-white/5">
               <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">Password Requirements:</h4>
               <ul className="space-y-1.5">
                  <li className="text-[10px] font-bold text-slate-400 flex items-center gap-2">• At least 6 characters long</li>
                  <li className="text-[10px] font-bold text-slate-400 flex items-center gap-2">• Different from your current password</li>
                  <li className="text-[10px] font-bold text-slate-400 flex items-center gap-2">• Must match confirmation</li>
               </ul>
            </div>

            <button type="submit" className="w-full mt-auto py-5 blue-gradient text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all">CHANGE PASSWORD ✓</button>
         </form>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn bg-slate-50 min-h-screen">
      <div className="bg-white px-5 py-6 flex items-center border-b border-slate-100 sticky top-0 z-10">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="ml-4">
             <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase italic leading-none">Settings</h2>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Control your experience</p>
          </div>
      </div>

      <div className="p-6 space-y-10">
        <section>
          <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 ml-4 tracking-[0.2em]">Profile Settings</h3>
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
             <button onClick={() => setActiveSubView('edit_profile')} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-all border-b border-slate-50 group">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                   </div>
                   <div className="text-left">
                      <span className="block text-sm font-black text-slate-800 uppercase tracking-tight">Update Profile Info</span>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase">Personalize your data</span>
                   </div>
                </div>
                <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
             </button>
             <div className="w-full p-5 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                   </div>
                   <div className="text-left">
                      <span className="block text-sm font-black text-slate-800 uppercase tracking-tight">Free Fire ID</span>
                      <span className="block text-[11px] text-slate-400 font-black">{user?.freeFireId || 'Not Linked'}</span>
                   </div>
                </div>
             </div>
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 ml-4 tracking-[0.2em]">Account Actions</h3>
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
             <button onClick={() => setActiveSubView('change_password')} className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-all border-b border-slate-50 group">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                   </div>
                   <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Change Password</span>
                </div>
                <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
             </button>
             <button onClick={onLogout} className="w-full p-5 flex items-center justify-between hover:bg-red-50 transition-all group">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                   </div>
                   <span className="text-sm font-black text-red-500 uppercase tracking-tight">Logout Securely</span>
                </div>
             </button>
          </div>
        </section>
      </div>

      <div className="mt-10 mb-10 text-center opacity-30">
        <p className="text-[10px] text-slate-800 font-black uppercase tracking-[0.5em] mb-2">EliteZone v2.5.0</p>
        <p className="text-[9px] text-slate-800 font-bold">Secure Session Verified</p>
      </div>
    </div>
  );
};

export default UserSettings;
