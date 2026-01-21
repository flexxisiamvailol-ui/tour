
import React, { useState } from 'react';
import { AppConfig, Poster, Category } from '../types';

interface AdminSettingsProps {
  appConfig: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ appConfig, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'banners' | 'links' | 'features' | 'categories' | 'security'>('branding');
  const [isSyncing, setIsSyncing] = useState(false);
  const [localConfig, setLocalConfig] = useState<AppConfig>(appConfig);

  const [adminSettings, setAdminSettings] = useState({
    adminId: localStorage.getItem('elitezone_admin_id') || '@admin11',
    adminPassword: localStorage.getItem('elitezone_admin_pass') || 'rexv7n@77',
  });

  const handleSave = () => {
    setIsSyncing(true);
    localStorage.setItem('elitezone_admin_id', adminSettings.adminId);
    localStorage.setItem('elitezone_admin_pass', adminSettings.adminPassword);
    onUpdateConfig(localConfig);

    setTimeout(() => {
      setIsSyncing(false);
      alert('সবগুলো সেটিংস সফলভাবে সেভ করা হয়েছে!');
    }, 1200);
  };

  const toggleFlag = (key: keyof AppConfig) => {
    setLocalConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUpdatePoster = (index: number, updates: Partial<Poster>) => {
    const newPosters = [...localConfig.posters];
    newPosters[index] = { ...newPosters[index], ...updates };
    setLocalConfig({ ...localConfig, posters: newPosters });
  };

  const handleAddCategory = () => {
    const newCat: Category = {
      id: `cat_${Date.now()}`,
      label: 'New Category',
      bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400',
      link: ''
    };
    setLocalConfig(prev => ({ ...prev, categories: [...(prev.categories || []), newCat] }));
  };

  const handleUpdateCategory = (id: string, updates: Partial<Category>) => {
    setLocalConfig(prev => ({
      ...prev,
      categories: (prev.categories || []).map(cat => cat.id === id ? { ...cat, ...updates } : cat)
    }));
  };

  const handleDeleteCategory = (id: string) => {
    setLocalConfig(prev => ({
      ...prev,
      categories: (prev.categories || []).filter(cat => cat.id !== id)
    }));
  };

  return (
    <div className="animate-fadeIn pb-10">
      <div className="mb-6 flex justify-between items-end px-1">
        <div>
          <h2 className="text-3xl font-black text-slate-800 mb-1 tracking-tighter italic font-gaming">Global Hub</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Application Control Center</p>
        </div>
      </div>

      <div className="p-1 sm:p-1.5 bg-slate-200/50 backdrop-blur-md rounded-2xl sm:rounded-[2.5rem] mb-6 sm:mb-8 shadow-inner flex overflow-x-auto no-scrollbar border border-white">
        {['branding', 'banners', 'links', 'features', 'categories', 'security'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`relative z-10 flex-1 min-w-[80px] sm:min-w-[90px] py-3 sm:py-4 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.1em] transition-all rounded-xl sm:rounded-[2.25rem] ${
              activeTab === tab ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-500'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[1.5rem] sm:rounded-[3rem] p-5 sm:p-8 border border-slate-100 shadow-xl space-y-6 sm:space-y-8 animate-fadeIn min-h-[500px]">
        {activeTab === 'branding' && (
          <div className="space-y-8">
            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-4">Branding & Identity</h3>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1 tracking-widest">App Name</label>
                <input 
                  value={localConfig.appName}
                  onChange={e => setLocalConfig({...localConfig, appName: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-800 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1 tracking-widest">App Logo URL</label>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                    <img src={localConfig.appLogoUrl} className="w-full h-full object-contain" alt="Logo Preview" />
                  </div>
                  <input 
                    value={localConfig.appLogoUrl}
                    onChange={e => setLocalConfig({...localConfig, appLogoUrl: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-600 text-xs focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1 tracking-widest">Global Tournament Rules</label>
                <textarea 
                  value={localConfig.rules}
                  onChange={e => setLocalConfig({...localConfig, rules: e.target.value})}
                  placeholder="Enter global rules (one per line)..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 text-sm focus:border-indigo-500 h-40 transition-all outline-none resize-none"
                />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-4">Home Slider Configuration (3 Posters)</h3>
            
            <div className="space-y-10">
              {[0, 1, 2].map(idx => (
                <div key={idx} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-200 space-y-4">
                  <p className="text-[10px] font-black text-indigo-600 uppercase italic">Slider Poster #{idx + 1}</p>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Image URL</label>
                    <input 
                      value={localConfig.posters[idx]?.imageUrl || ''}
                      onChange={e => handleUpdatePoster(idx, { imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Redirect Link</label>
                      <input 
                        value={localConfig.posters[idx]?.link || ''}
                        onChange={e => handleUpdatePoster(idx, { link: e.target.value })}
                        placeholder="Web/In-app link"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">YouTube Link</label>
                      <input 
                        value={localConfig.posters[idx]?.ytLink || ''}
                        onChange={e => handleUpdatePoster(idx, { ytLink: e.target.value })}
                        placeholder="https://youtube.com/..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100">
               <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-4">Main Live Announcement Poster</h3>
               <div className="p-6 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 space-y-6">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block ml-1">Live Image URL</label>
                  <input 
                    value={localConfig.liveBannerUrl || ''}
                    onChange={e => setLocalConfig({...localConfig, liveBannerUrl: e.target.value})}
                    placeholder="https://images..."
                    className="w-full bg-white border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-700 shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block ml-1">Live Redirect/YT Link</label>
                  <input 
                    value={localConfig.liveBannerLink || ''}
                    onChange={e => setLocalConfig({...localConfig, liveBannerLink: e.target.value})}
                    placeholder="https://youtube.com/live/..."
                    className="w-full bg-white border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-700 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-4">Support & Payments</h3>
            
            <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 mb-6 space-y-6">
               <h4 className="text-[10px] font-black uppercase text-amber-900 tracking-widest italic ml-1">Payment Tutorial Videos (YouTube)</h4>
               <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block ml-1">bKash Tutorial URL</label>
                  <input 
                    value={localConfig.bkashTutorialUrl || ''}
                    onChange={e => setLocalConfig({...localConfig, bkashTutorialUrl: e.target.value})}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-white border-2 border-amber-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:border-amber-500 transition-all outline-none"
                  />
               </div>
               <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block ml-1">Nagad Tutorial URL</label>
                  <input 
                    value={localConfig.nagadTutorialUrl || ''}
                    onChange={e => setLocalConfig({...localConfig, nagadTutorialUrl: e.target.value})}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-white border-2 border-amber-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:border-amber-500 transition-all outline-none"
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1 tracking-widest">bKash Number</label>
                <input 
                  value={localConfig.bkashNumber}
                  onChange={e => setLocalConfig({...localConfig, bkashNumber: e.target.value})}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1 tracking-widest">Nagad Number</label>
                <input 
                  value={localConfig.nagadNumber}
                  onChange={e => setLocalConfig({...localConfig, nagadNumber: e.target.value})}
                  placeholder="018XXXXXXXX"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1 tracking-widest">Telegram Support URL</label>
              <input 
                value={localConfig.telegramSupportUrl}
                onChange={e => setLocalConfig({...localConfig, telegramSupportUrl: e.target.value})}
                placeholder="https://t.me/support"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-4">Module Management</h3>
            {[
              { id: 'isLeaderboardEnabled', label: 'Leaderboard Access' },
              { id: 'isWalletEnabled', label: 'Financial Wallet' },
              { id: 'showHomeBalanceCard', label: 'Home Balance Card' },
              { id: 'showHomeCategories', label: 'Home Categories' },
            ].map((f) => (
              <div key={f.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{f.label}</p>
                <button 
                  onClick={() => toggleFlag(f.id as any)}
                  className={`w-14 h-8 rounded-full transition-all duration-500 relative ${localConfig[f.id as keyof AppConfig] ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-500 ${localConfig[f.id as keyof AppConfig] ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">Match Categories</h3>
              <button 
                onClick={handleAddCategory}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95"
              >
                + Add New
              </button>
            </div>
            
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
              {(localConfig.categories || []).map((cat) => (
                <div key={cat.id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-200 space-y-4 relative">
                  <button 
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <div>
                    <label className="text-[8px] font-black uppercase text-slate-400 mb-1 block">Category Label</label>
                    <input 
                      value={cat.label}
                      onChange={e => handleUpdateCategory(cat.id, { label: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-black uppercase"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[8px] font-black uppercase text-slate-400 mb-1 block">Banner Image URL</label>
                    <input 
                      value={cat.bannerUrl}
                      onChange={e => handleUpdateCategory(cat.id, { bannerUrl: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[8px] font-black uppercase text-slate-400 mb-1 block">Redirect Link (Web/In-app)</label>
                    <input 
                      value={cat.link || ''}
                      onChange={e => handleUpdateCategory(cat.id, { link: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-4">Authentication Control</h3>
            <div className="p-8 bg-indigo-50 rounded-[2.5rem] border-2 border-indigo-100 space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-400 mb-2 ml-1 tracking-widest">Master Admin ID</p>
                <input 
                  value={adminSettings.adminId}
                  onChange={e => setAdminSettings({...adminSettings, adminId: e.target.value})}
                  className="w-full bg-white border-none rounded-xl px-4 py-3 font-black text-indigo-900 shadow-sm"
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-400 mb-2 ml-1 tracking-widest">Secret Admin Key</p>
                <input 
                  type="text"
                  value={adminSettings.adminPassword}
                  onChange={e => setAdminSettings({...adminSettings, adminPassword: e.target.value})}
                  className="w-full bg-white border-none rounded-xl px-4 py-3 font-black text-slate-800 shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-6">
          <button 
            onClick={handleSave}
            disabled={isSyncing}
            className={`w-full font-black py-5 rounded-[2.5rem] uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 ${
              isSyncing ? 'bg-indigo-400 text-white cursor-not-allowed' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
            }`}
          >
            {isSyncing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'Update Application Cloud'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
