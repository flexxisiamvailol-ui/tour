
import React, { useState } from 'react';
import { User, Transaction, TransactionType, TransactionStatus } from '../types';

interface AdminUsersProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ users, setUsers, setTransactions }) => {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  
  const filtered = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    u.uid.toLowerCase().includes(search.toLowerCase()) ||
    (u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleManualAdjustment = (type: 'add' | 'subtract') => {
    if (!selectedUser || !adjustAmount) return;
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount <= 0) return;

    const finalAmount = type === 'add' ? amount : -amount;

    setUsers(prev => prev.map(u => 
      u.uid === selectedUser.uid ? { ...u, wallet: u.wallet + finalAmount } : u
    ));

    const newTx: Transaction = {
      id: `manual_${Date.now()}`,
      userId: selectedUser.uid,
      userEmail: selectedUser.email,
      amount: amount,
      type: type === 'add' ? TransactionType.DEPOSIT : TransactionType.WITHDRAW,
      status: TransactionStatus.APPROVED,
      timestamp: new Date().toISOString(),
      matchTitle: 'Manual Admin Adjustment'
    };
    setTransactions(prev => [newTx, ...prev]);

    alert(`Successfully ${type === 'add' ? 'added' : 'deducted'} ৳${amount} to ${selectedUser.email}`);
    setSelectedUser(null);
    setAdjustAmount('');
  };

  const toggleBanStatus = (uid: string) => {
    setUsers(prev => prev.map(u => 
      u.uid === uid ? { ...u, isBanned: !u.isBanned } : u
    ));
  };

  return (
    <div className="animate-fadeIn pb-10">
      <div className="relative mb-6 group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input type="text" placeholder="Search Players..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white rounded-[1.5rem] sm:rounded-[2rem] pl-16 pr-8 py-4 sm:py-5 text-sm font-bold shadow-sm border border-slate-100 focus:outline-none focus:ring-2 ring-indigo-500 transition-all" />
      </div>

      <div className="space-y-4">
        {filtered.map(user => (
          <div key={user.uid} className={`bg-white p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between transition-all ${user.isBanned ? 'opacity-70 grayscale' : ''}`}>
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              <div className="relative shrink-0">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl font-black border ${user.isAdmin ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>{user.email.charAt(0).toUpperCase()}</div>
                {user.isBanned && <div className="absolute -bottom-1 -left-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] border-2 border-white">🚫</div>}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-black text-slate-800 text-xs sm:text-sm uppercase tracking-tight leading-none truncate">{user.fullName || user.email.split('@')[0]}</h4>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">৳{user.wallet.toFixed(0)}</p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0 ml-2">
              <button onClick={() => toggleBanStatus(user.uid)} className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all ${user.isBanned ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-400 hover:text-red-600'}`} title="Toggle Ban">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              </button>
              <button onClick={() => setSelectedUser(user)} className="bg-slate-50 text-slate-300 p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></button>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-end animate-fadeIn">
          <div className="bg-slate-50 w-full max-w-md mx-auto rounded-t-[3rem] p-8 shadow-2xl space-y-6">
            <div className="text-center"><h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Adjust Wallet</h3><p className="text-xs font-bold text-slate-400 mt-1">{selectedUser.email}</p></div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <input type="number" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} placeholder="Amount..." className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-2xl text-slate-900 focus:ring-2 ring-indigo-500 transition-all shadow-inner" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleManualAdjustment('add')} className="bg-green-500 text-white font-black py-5 rounded-3xl uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all">Add Money</button>
              <button onClick={() => handleManualAdjustment('subtract')} className="bg-red-500 text-white font-black py-5 rounded-3xl uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all">Subtract</button>
            </div>
            <button onClick={() => setSelectedUser(null)} className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
