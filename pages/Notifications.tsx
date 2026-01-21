
import React from 'react';

const Notifications: React.FC = () => {
  const notifications = [
    {
      id: 1,
      title: 'Match Cancelled & Refunded',
      desc: 'The match "Elite Friday Scrims" was cancelled by Admin. Your entry fee of ₹10 has been successfully refunded to your wallet balance.',
      time: 'JAN 11, 01:43 PM',
      icon: '❌',
      color: 'bg-red-50 text-red-500'
    },
    {
      id: 2,
      title: 'Room Details Published',
      desc: 'Room ID and Password for your upcoming match "Daily Solo Warmup" are now available in your match details. Join now!',
      time: 'JAN 11, 12:43 PM',
      icon: '🔑',
      color: 'bg-amber-50 text-amber-500'
    },
    {
      id: 3,
      title: 'Deposit Approved',
      desc: 'Your deposit request of ₹500 has been verified and added to your wallet. You are now ready to battle!',
      time: 'JAN 10, 01:43 PM',
      icon: '💰',
      color: 'bg-green-50 text-green-500'
    }
  ];

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8 px-1">
        <h2 className="text-xs font-black uppercase text-slate-400 tracking-[0.3em]">Recent Activity</h2>
        <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">Clear All</button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n.id} className="bg-white p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 flex gap-4 sm:gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-[1.5rem] flex items-center justify-center text-xl sm:text-2xl shadow-inner border border-white ${n.color}`}>
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-tight leading-tight truncate mr-2">{n.title}</h4>
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-indigo-500 rounded-full shadow-lg shadow-indigo-200 shrink-0 mt-1"></div>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-relaxed mb-2 line-clamp-2">{n.desc}</p>
                <p className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest">{n.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 opacity-60 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
               </svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">All caught up!</h3>
            <p className="text-xs font-bold text-slate-400">No new notifications for you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
