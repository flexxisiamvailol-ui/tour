
import React, { useState } from 'react';
import { Transaction, TransactionStatus, TransactionType, User } from '../types';

interface AdminTransactionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AdminTransactions: React.FC<AdminTransactionsProps> = ({ transactions, setTransactions, users, setUsers }) => {
  const [filter, setFilter] = useState<TransactionType>(TransactionType.DEPOSIT);
  const pendingTransactions = transactions.filter(t => t.type === filter && t.status === TransactionStatus.PENDING);

  const handleProcess = (txId: string, status: TransactionStatus) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.status !== TransactionStatus.PENDING) return;

    const user = users.find(u => u.uid === tx.userId);
    if (!user && status === TransactionStatus.APPROVED) {
      alert("Error: User not found!");
      return;
    }

    if (status === TransactionStatus.APPROVED) {
      if (tx.type === TransactionType.DEPOSIT) {
        // Immediate wallet update for Deposit
        setUsers(prev => prev.map(u => 
          u.uid === tx.userId ? { ...u, wallet: u.wallet + tx.amount } : u
        ));
      } else if (tx.type === TransactionType.WITHDRAW) {
        if (user && user.wallet < tx.amount) {
          alert("Insufficient balance. এই ইউজারের পর্যাপ্ত ব্যালেন্স নেই।");
          return;
        }
        // Immediate wallet update for Withdrawal
        setUsers(prev => prev.map(u => 
          u.uid === tx.userId ? { ...u, wallet: Math.max(0, u.wallet - tx.amount) } : u
        ));
      }
    }
    
    // Update Transaction Status
    setTransactions(prev => prev.map(t => 
      t.id === txId ? { ...t, status: status } : t
    ));

    const msg = status === TransactionStatus.APPROVED 
      ? `সফলভাবে অ্যাপ্রুভ করা হয়েছে! ইউজারের ওয়ালেটে ৳${tx.amount} যোগ করা হয়েছে।`
      : 'রিকুয়েস্টটি রিজেক্ট করা হয়েছে।';
    
    alert(msg);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
        <button 
          onClick={() => setFilter(TransactionType.DEPOSIT)}
          className={`flex-1 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[1.75rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border-2 ${
            filter === TransactionType.DEPOSIT ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white text-slate-400 border-slate-100'
          }`}
        >
          Deposits
        </button>
        <button 
          onClick={() => setFilter(TransactionType.WITHDRAW)}
          className={`flex-1 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[1.75rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border-2 ${
            filter === TransactionType.WITHDRAW ? 'bg-red-600 text-white border-red-600 shadow-xl' : 'bg-white text-slate-400 border-slate-100'
          }`}
        >
          Withdraws
        </button>
      </div>

      <div className="space-y-4">
        {pendingTransactions.length > 0 ? (
          pendingTransactions.map(tx => (
            <div key={tx.id} className="bg-white p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 animate-fadeIn">
              <div className="flex justify-between items-start mb-4 overflow-hidden">
                <div className="overflow-hidden">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 truncate">ID: {tx.id.slice(-6)}</p>
                  <h4 className="font-black text-slate-800 text-xs sm:text-sm leading-tight mb-0.5 truncate">{tx.userEmail}</h4>
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xl sm:text-2xl font-oswald font-black leading-none ${filter === TransactionType.DEPOSIT ? 'text-indigo-600' : 'text-red-500'}`}>
                     ৳{tx.amount}
                  </p>
                </div>
              </div>

              {tx.metadata && tx.type === TransactionType.DEPOSIT && (
                <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Method</span>
                    <span className={`text-[9px] font-black uppercase ${tx.metadata.method === 'bKash' ? 'text-pink-600' : 'text-orange-600'}`}>{tx.metadata.method}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">TrxID</span>
                    <span className="text-xs font-black text-slate-900 tracking-wider select-all">{tx.metadata.trxId}</span>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button 
                  onClick={() => handleProcess(tx.id, TransactionStatus.APPROVED)}
                  className="w-full sm:flex-1 bg-indigo-600 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleProcess(tx.id, TransactionStatus.REJECTED)}
                  className="w-full sm:bg-slate-50 text-slate-400 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all border sm:border-none border-slate-100"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 flex flex-col items-center opacity-40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Pending Requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactions;
