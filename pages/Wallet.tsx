
import React, { useState } from 'react';
import { User, TransactionType, AppConfig } from '../types';

interface WalletProps {
  user: User;
  appConfig: AppConfig;
  onTransaction: (amount: number, type: TransactionType, metadata?: any) => void;
}

const Wallet: React.FC<WalletProps> = ({ user, appConfig, onTransaction }) => {
  const [amount, setAmount] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [senderNumber, setSenderNumber] = useState<string>('');
  const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    
    if (isNaN(val) || val <= 0) {
      alert("সঠিক পরিমাণ প্রদান করুন।");
      return;
    }
    
    if (val < 10) {
      alert("মিনিমাম ১০ টাকা হতে হবে।");
      return;
    }
    
    if (activeTab === 'withdraw' && val > user.wallet) {
      alert("আপনার ব্যালেন্স পর্যাপ্ত নয়।");
      return;
    }

    if (activeTab === 'deposit') {
      if (trxId.trim().length < 5) {
        alert("সঠিক TrxID প্রদান করুন।");
        return;
      }
      if (!senderNumber.trim()) {
        alert("আপনার নাম্বারটি প্রদান করুন।");
        return;
      }
    }

    onTransaction(val, activeTab === 'deposit' ? TransactionType.DEPOSIT : TransactionType.WITHDRAW, {
      method: method,
      trxId: activeTab === 'deposit' ? trxId : undefined,
      phoneNumber: senderNumber
    });
    
    setAmount('');
    setTrxId('');
    setSenderNumber('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('নাম্বারটি কপি করা হয়েছে!');
  };

  const paymentNumber = method === 'bKash' ? appConfig.bkashNumber : appConfig.nagadNumber;
  const tutorialUrl = method === 'bKash' ? (appConfig.bkashTutorialUrl || appConfig.howToPlayUrl) : (appConfig.nagadTutorialUrl || appConfig.howToPlayUrl);

  return (
    <div className="animate-fadeIn pb-10">
      <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200 mb-8 flex flex-col items-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
        
        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-3">Total Balance</span>
        <span className="text-5xl font-oswald font-black tracking-tighter">৳{user.wallet.toFixed(2)}</span>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm overflow-hidden mb-6">
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[1.75rem] mb-6 shadow-inner border border-slate-200/50">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'deposit' ? 'bg-white text-indigo-600 shadow-md border border-slate-100' : 'text-slate-400'
            }`}
          >
            Deposit Money
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'withdraw' ? 'bg-white text-indigo-600 shadow-md border border-slate-100' : 'text-slate-400'
            }`}
          >
            Withdraw Now
          </button>
        </div>

        {activeTab === 'deposit' && (
          <div className="mb-6">
            <div className="bg-[#1e1b4b] rounded-3xl p-5 mb-6 text-white text-[11px] leading-relaxed">
              <h3 className="font-bold text-sm mb-3">পেমেন্ট পদ্ধতি নির্বাচন করুন</h3>
              <ul className="space-y-1.5 opacity-90">
                <li className="flex items-start gap-2">• ১ কয়েন = ১ টাকা।</li>
                <li className="flex items-start gap-2">• আপনি যত কয়েন কিনবেন, তত টাকাই পরিশোধ করতে হবে।</li>
                <li className="flex items-start gap-2">• পেমেন্ট করার আগে সঠিক পরিমাণ এবং পেমেন্ট পদ্ধতি নির্বাচন করুন।</li>
                <li className="flex items-start gap-2">• পেমেন্ট সম্পন্ন হলে স্বয়ংক্রিয়ভাবে আপনার একাউন্টে যোগ হবে।</li>
                <li className="flex items-start gap-2">• কোনো সমস্যা হলে সাপোর্টে যোগাযোগ করুন।</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => setMethod('bKash')}
                className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 border-2 transition-all relative ${method === 'bKash' ? 'border-[#e2136e] bg-[#e2136e]/5' : 'border-slate-100'}`}
              >
                <div className="w-6 h-6 shrink-0 bg-[#e2136e] rounded-md flex items-center justify-center">
                  <span className="text-white text-[10px] font-black">b</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-black ${method === 'bKash' ? 'text-[#e2136e]' : 'text-slate-400'}`}>Bkash</span>
                  {method === 'bKash' && <span className="text-[8px] font-bold text-[#e2136e] flex items-center gap-1">✓ Selected</span>}
                </div>
              </button>
              <button 
                onClick={() => setMethod('Nagad')}
                className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 border-2 transition-all relative ${method === 'Nagad' ? 'border-[#f6921e] bg-[#f6921e]/5' : 'border-slate-100'}`}
              >
                <div className="w-6 h-6 shrink-0 bg-[#f6921e] rounded-md flex items-center justify-center">
                  <span className="text-white text-[10px] font-black">n</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-black ${method === 'Nagad' ? 'text-[#f6921e]' : 'text-slate-400'}`}>Nagad</span>
                  {method === 'Nagad' && <span className="text-[8px] font-bold text-[#f6921e] flex items-center gap-1">✓ Selected</span>}
                </div>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-[10px] uppercase font-black text-slate-400 mb-2 ml-1 tracking-widest">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              আপনার {method} নাম্বার
            </label>
            <input
              type="text"
              required
              value={senderNumber}
              onChange={(e) => setSenderNumber(e.target.value)}
              placeholder="আপনার নাম্বারটি লিখুন"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-bold"
            />
          </div>

          {activeTab === 'deposit' && (
            <div>
              <label className="flex items-center gap-2 text-[10px] uppercase font-black text-slate-400 mb-2 ml-1 tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ট্রানজেকশন আইডি
              </label>
              <input
                type="text"
                required
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="ট্রানজেকশন আইডি লিখুন"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-bold uppercase"
              />
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 text-[10px] uppercase font-black text-slate-400 mb-2 ml-1 tracking-widest">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              পরিমাণ (টাকা)
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="টাকার পরিমাণ লিখুন"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-indigo-500 transition-all font-black text-lg"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-5 rounded-[1.75rem] font-black uppercase tracking-widest text-[11px] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] text-white ${activeTab === 'deposit' ? (method === 'bKash' ? 'bg-[#e2136e] shadow-[#e2136e]/20' : 'bg-[#f6921e] shadow-[#f6921e]/20') : 'bg-indigo-600 shadow-indigo-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            রিকুয়েস্ট পাঠান
          </button>
        </form>
      </div>

      {activeTab === 'deposit' && (
        <div className={`rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm animate-fadeIn ${method === 'bKash' ? 'bg-[#e2136e]' : 'bg-[#f6921e]'}`}>
          <div className="p-6 text-white">
            <h4 className="text-base font-black uppercase tracking-tight mb-5 text-center">
              {method} পেমেন্ট নির্দেশনা
            </h4>

            <button 
              onClick={() => window.open(tutorialUrl, '_blank')}
              className="w-full bg-black/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between mb-6 group border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-white" viewBox="0 0 20 20">
                     <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                   </svg>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest">{method} ভিডিও টিউটোরিয়াল দেখুন</span>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <div className="space-y-4">
               <div>
                 <p className="text-[10px] font-black uppercase opacity-60 mb-2 ml-1">একাউন্ট নাম্বার</p>
                 <div className="bg-white rounded-2xl p-4 flex justify-between items-center border border-white/20 shadow-lg">
                    <span className="text-lg font-black text-slate-800 tracking-tight">{paymentNumber}</span>
                    <button 
                      onClick={() => copyToClipboard(paymentNumber)}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all text-white ${method === 'bKash' ? 'bg-[#e2136e]' : 'bg-[#f6921e]'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      কপি
                    </button>
                 </div>
               </div>

               <div className="bg-white rounded-[2rem] p-6 text-slate-800 space-y-4">
                  <h5 className="text-[11px] font-black uppercase tracking-widest text-indigo-600 border-b pb-3 mb-2">পেমেন্ট পদ্ধতি</h5>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 border border-slate-200">1</span>
                      <p className="text-[11px] font-bold leading-relaxed">*247# ডায়াল করে আপনার {method} অ্যাপ ওপেন করুন</p>
                    </div>
                    <div className="flex gap-4">
                      <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 border border-slate-200">2</span>
                      <p className="text-[11px] font-bold leading-relaxed">"সেন্ড মানি" অপশনে ক্লিক করুন</p>
                    </div>
                    <div className="flex gap-4">
                      <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 border border-slate-200">3</span>
                      <p className="text-[11px] font-bold leading-relaxed">উপরে দেখানো একাউন্ট নাম্বারে টাকা পাঠান</p>
                    </div>
                    <div className="flex gap-4">
                      <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 border border-slate-200">4</span>
                      <p className="text-[11px] font-bold leading-relaxed">আপনার {method} পিন নম্বর দিয়ে পেমেন্ট কনফার্ম করুন</p>
                    </div>
                    <div className="flex gap-4">
                      <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 border border-slate-200">5</span>
                      <p className="text-[11px] font-bold leading-relaxed">পেমেন্ট করার পর আপনার নম্বর, ট্রানজেকশন আইডি এবং টাকার পরিমাণ লিখে ফর্মে রিকুয়েস্ট পাঠান</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
