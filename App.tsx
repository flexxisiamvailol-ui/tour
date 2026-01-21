
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, Match, Transaction, AdminView, View, MatchStatus, TransactionType, TransactionStatus, AppConfig, Poster, Registration, Category } from './types';
import { INITIAL_MATCHES } from './constants';
import AdminDashboard from './pages/AdminDashboard';
import AdminMatches from './pages/AdminMatches';
import AdminTransactions from './pages/AdminTransactions';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';
import AdminAuth from './pages/AdminAuth';
import AdminHeader from './components/AdminHeader';
import AdminBottomNav from './components/AdminBottomNav';
import AdminWinners from './pages/AdminWinners';

// User Panel Pages
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Auth from './pages/Auth';
import UserSettings from './pages/UserSettings';
import Wallet from './pages/Wallet';
import History from './pages/History';
import MatchDetails from './pages/MatchDetails';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import Toast, { ToastType } from './components/Toast';
import SplashScreen from './components/SplashScreen';

const DEFAULT_POSTERS: Poster[] = [
  { id: 'p1', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800', link: '', ytLink: '' },
  { id: 'p2', imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800', link: '', ytLink: '' },
  { id: 'p3', imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800', link: '', ytLink: '' },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_1', label: 'BR DUO MACH', bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400', link: '' },
  { id: 'cat_2', label: 'BR SOLO MACH', bannerUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=400', link: '' },
  { id: 'cat_3', label: 'CLASH SQUAD', bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400', link: '' },
  { id: 'cat_4', label: 'BR SQUAD MACH', bannerUrl: 'https://images.unsplash.com/photo-1614027164847-1b2809eb7b9c?auto=format&fit=crop&q=80&w=400', link: '' },
];

const DEFAULT_CONFIG: AppConfig = {
  appName: 'Crazy Tour Pro',
  appLogoUrl: 'https://cdn-icons-png.flaticon.com/512/3665/3665923.png',
  primaryColor: '#6366f1',
  homeBannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
  notice: 'Crazy Tour Pro-এ আপনাকে স্বাগতম!\nপ্রতিদিনের টুর্নামেন্টে অংশ নিন এবং জিতে নিন আকর্ষণীয় পুরস্কার।',
  liveAnnouncement: '📢 লাইভ টুর্নামেন্ট শুরু হয়েছে! এখনই জয়েন করুন এবং জিতে নিন আকর্ষণীয় পুরস্কার।',
  howToPlayUrl: 'https://youtube.com',
  bkashTutorialUrl: 'https://youtube.com',
  nagadTutorialUrl: 'https://youtube.com',
  rules: '১. কোন প্রকার হ্যাকিং বা চিটিং গ্রহণযোগ্য নয়।\n২. ইমুলেটর ব্যবহার সম্পূর্ণ নিষিদ্ধ।\n৩. রুম আইডি এবং পাসওয়ার্ড ম্যাচের ১৫ মিনিট আগে দেওয়া হবে।\n৪. টিমিং করলে সরাসরি ব্যান করা হবে।\n৫. সঠিক গেম আইডি ব্যবহার করতে হবে।',
  telegramSupportUrl: 'https://t.me/your_support',
  telegramCommunityUrl: 'https://t.me/your_community',
  supportPhone: '+880123456789',
  bkashNumber: '017XXXXXXXX',
  nagadNumber: '018XXXXXXXX',
  isLeaderboardEnabled: true,
  isWalletEnabled: true,
  isNotificationsEnabled: true,
  isHistoryEnabled: true,
  isSliderEnabled: false,
  posters: DEFAULT_POSTERS,
  isSliderLogoEnabled: true,
  isSliderAppNameEnabled: true,
  sliderLogoSize: 64,
  loadingText: 'Loading assets...',
  showHomeBalanceCard: true,
  showHomeCategories: true,
  categories: INITIAL_CATEGORIES
};

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false); 
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminView, setAdminView] = useState<AdminView>('auth');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userView, setUserView] = useState<View>('home');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isBootstrapping, setIsBootstrapping] = useState<boolean>(true);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [showAuthSuccess, setShowAuthSuccess] = useState<boolean>(false);
  
  const [logoTapCount, setLogoTapCount] = useState<number>(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type, isVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  useEffect(() => {
    const initApp = async () => {
      const savedMatches = localStorage.getItem('elitezone_matches');
      const savedTransactions = localStorage.getItem('elitezone_transactions');
      const savedUsers = localStorage.getItem('elitezone_users');
      const savedUserSession = localStorage.getItem('elitezone_user_session');
      const savedAdminSession = localStorage.getItem('elitezone_admin_session');
      const savedConfig = localStorage.getItem('elitezone_app_config');

      if (savedMatches) setMatches(JSON.parse(savedMatches));
      else setMatches(INITIAL_MATCHES);

      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      
      let parsedUsers: User[] = [];
      if (savedUsers) {
        parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers);
      } else {
        parsedUsers = [{ uid: 'u1', email: 'gamer@elitezone.com', password: '123', wallet: 50, fullName: 'Elite Gamer', freeFireId: '123456789' }];
        setUsers(parsedUsers);
        localStorage.setItem('elitezone_users', JSON.stringify(parsedUsers));
      }

      if (savedConfig) {
        setAppConfig({ ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) });
      }

      if (savedUserSession) {
        const sessionUid = JSON.parse(savedUserSession).uid;
        const found = parsedUsers.find(u => u.uid === sessionUid);
        if (found) {
          if (found.isBanned) {
            localStorage.removeItem('elitezone_user_session');
            setUserView('auth');
          } else {
            setCurrentUser(found);
            setUserView('home');
          }
        } else {
          setUserView('auth');
          localStorage.removeItem('elitezone_user_session');
        }
      } else {
        setUserView('auth');
      }

      if (savedAdminSession === 'true') {
        setIsAdminLoggedIn(true);
        setIsAdmin(true);
        setAdminView('dashboard');
      }

      setIsBootstrapping(false);
      setTimeout(() => {
        setShowSplash(false);
      }, 3500);
    };

    initApp();
  }, []);

  useEffect(() => {
    if (!isBootstrapping) {
      localStorage.setItem('elitezone_matches', JSON.stringify(matches));
      localStorage.setItem('elitezone_transactions', JSON.stringify(transactions));
      localStorage.setItem('elitezone_users', JSON.stringify(users));
      localStorage.setItem('elitezone_app_config', JSON.stringify(appConfig));
    }
  }, [matches, transactions, users, appConfig, isBootstrapping]);

  // SYNC: Real-time wallet sync and ban detection
  useEffect(() => {
    if (currentUser) {
      const updatedUser = users.find(u => u.uid === currentUser.uid);
      if (updatedUser) {
        if (updatedUser.isBanned) {
          setCurrentUser(null);
          localStorage.removeItem('elitezone_user_session');
          setUserView('auth');
          showToast('ACCOUNT BLOCKED BY ADMIN', 'error');
        } else {
          if (JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
            setCurrentUser(updatedUser);
          }
        }
      }
    }
  }, [users, currentUser, showToast]);

  const handleUpdateProfile = (data: Partial<User>) => {
    if (currentUser) {
      const updated = { ...currentUser, ...data };
      setCurrentUser(updated);
      setUsers(prev => prev.map(u => u.uid === currentUser.uid ? updated : u));
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setUsers(prev => {
      if (!prev.find(u => u.uid === user.uid)) {
        return [...prev, user];
      }
      return prev;
    });
    
    localStorage.setItem('elitezone_user_session', JSON.stringify({ uid: user.uid }));
    setShowAuthSuccess(true);
  };

  const handleAuthModalClose = () => {
    setShowAuthSuccess(false);
    setUserView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('elitezone_user_session');
    setUserView('auth');
    showToast('Securely Logged Out');
  };

  const handleAdminLogin = (id: string) => {
    setIsAdminLoggedIn(true);
    setIsAdmin(true);
    setAdminView('dashboard');
    localStorage.setItem('elitezone_admin_session', 'true');
    showToast('Admin Console Active', 'success');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('elitezone_admin_session');
    setUserView('home');
    setAdminView('auth');
  };

  const handleJoinMatch = (matchId: string, gameName?: string, slotNumber?: number) => {
    if (!currentUser) {
      setUserView('auth');
      return;
    }

    if (currentUser.isBanned) {
      showToast('Action Denied: Account Blocked', 'error');
      return;
    }

    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    if (match.joinedPlayers.includes(currentUser.uid)) {
      showToast('Already registered for this match!', 'info');
      return;
    }

    if (match.joinedPlayers.length >= match.maxPlayers) {
      showToast('Tournament Slot Full!', 'error');
      return;
    }

    if (currentUser.wallet < match.entryFee) {
      return;
    }

    // If gameName is provided but slotNumber isn't (new simple UI flow)
    // auto-assign the next available slot
    let finalSlot = slotNumber;
    if (gameName && !finalSlot) {
      const takenSlots = match.registrations.map(r => r.slotNumber);
      for (let i = 1; i <= match.maxPlayers; i++) {
        if (!takenSlots.includes(i)) {
          finalSlot = i;
          break;
        }
      }
    }

    if (!gameName || !finalSlot) {
      setSelectedMatchId(matchId);
      setUserView('match_details');
      return;
    }

    setIsJoining(true);
    setTimeout(() => {
      const updatedUser = { ...currentUser, wallet: currentUser.wallet - match.entryFee };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.uid === currentUser.uid ? updatedUser : u));

      const newRegistration: Registration = {
        uid: currentUser.uid,
        gameName,
        slotNumber: finalSlot!
      };

      setMatches(prev => prev.map(m => m.id === matchId ? { 
        ...m, 
        joinedPlayers: [...m.joinedPlayers, currentUser.uid],
        registrations: [...(m.registrations || []), newRegistration]
      } : m));

      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        amount: match.entryFee,
        type: TransactionType.ENTRY_FEE,
        status: TransactionStatus.APPROVED,
        timestamp: new Date().toISOString(),
        matchTitle: match.title
      };
      setTransactions(prev => [newTx, ...prev]);
      
      setIsJoining(false);
      showToast('Match Entry Confirmed!', 'success');
      setUserView('home');
    }, 2000);
  };

  const handleCancelMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const newTransactions: Transaction[] = [];
    const updatedUsers = [...users];

    match.joinedPlayers.forEach(uid => {
      const userIndex = updatedUsers.findIndex(u => u.uid === uid);
      if (userIndex !== -1) {
        updatedUsers[userIndex] = {
          ...updatedUsers[userIndex],
          wallet: updatedUsers[userIndex].wallet + match.entryFee
        };

        newTransactions.push({
          id: `refund_${Date.now()}_${uid}`,
          userId: uid,
          userEmail: updatedUsers[userIndex].email,
          amount: match.entryFee,
          type: TransactionType.REFUND,
          status: TransactionStatus.APPROVED,
          timestamp: new Date().toISOString(),
          matchTitle: `Refund: ${match.title}`
        });
      }
    });

    setUsers(updatedUsers);
    setTransactions(prev => [...newTransactions, ...prev]);
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: MatchStatus.FINISHED, isCancelled: true } : m));
    
    showToast(`Match cancelled. ${newTransactions.length} players refunded.`, 'success');
  };

  const handleTransactionRequest = (amount: number, type: TransactionType, metadata?: any) => {
    if (!currentUser) return;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      amount,
      type,
      status: TransactionStatus.PENDING,
      timestamp: new Date().toISOString(),
      metadata
    };
    setTransactions(prev => [newTx, ...prev]);
    showToast('Request Sent to Admin', 'info');
  };

  const handleLogoTap = () => {
    setLogoTapCount(prev => prev + 1);
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      if (logoTapCount >= 4) {
        setIsAdmin(true);
        setAdminView('auth');
        showToast('Entering Secret Admin Zone');
      }
      setLogoTapCount(0);
    }, 1000);
  };

  const renderUserContent = () => {
    switch (userView) {
      case 'home':
        return <Home appConfig={appConfig} matches={matches} onJoin={handleJoinMatch} currentUser={currentUser} onLoginRequest={() => setUserView('auth')} users={users} setView={setUserView} onSelectMatch={(id) => { setSelectedMatchId(id); setUserView('match_details'); }} />;
      case 'tournaments':
        return <Tournaments matches={matches} onJoin={handleJoinMatch} currentUser={currentUser} appConfig={appConfig} users={users} onSelectMatch={(id) => { setSelectedMatchId(id); setUserView('match_details'); }} />;
      case 'match_details':
        const match = matches.find(m => m.id === selectedMatchId);
        return match ? <MatchDetails match={match} onJoin={handleJoinMatch} currentUser={currentUser} onBack={() => setUserView('home')} setView={setUserView} /> : <Home appConfig={appConfig} matches={matches} onJoin={handleJoinMatch} currentUser={currentUser} onLoginRequest={() => setUserView('auth')} users={users} setView={setUserView} onSelectMatch={(id) => { setSelectedMatchId(id); setUserView('match_details'); }} />;
      case 'leaderboard': return <Leaderboard />;
      case 'profile': return <Profile user={currentUser} matches={matches} onLogout={handleLogout} onLoginRequest={() => setUserView('auth')} onSettingsClick={() => setUserView('settings')} setView={setUserView} onUpdateProfile={handleUpdateProfile} />;
      case 'notifications': return <Notifications />;
      case 'wallet': return currentUser ? <Wallet user={currentUser} appConfig={appConfig} onTransaction={handleTransactionRequest} /> : <Auth onAuthSuccess={handleAuthSuccess} users={users} setAdminMode={() => {setIsAdmin(true); setAdminView('auth');}} />;
      case 'history': return currentUser ? <History matches={matches} transactions={transactions} currentUser={currentUser} /> : <Auth onAuthSuccess={handleAuthSuccess} users={users} setAdminMode={() => {setIsAdmin(true); setAdminView('auth');}} />;
      case 'settings': return <UserSettings user={currentUser} onBack={() => setUserView('profile')} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} />;
      case 'auth': return <Auth onAuthSuccess={handleAuthSuccess} users={users} setAdminMode={() => {setIsAdmin(true); setAdminView('auth');}} />;
      default: return <Home appConfig={appConfig} matches={matches} onJoin={handleJoinMatch} currentUser={currentUser} onLoginRequest={() => setUserView('auth')} users={users} setView={setUserView} onSelectMatch={(id) => { setSelectedMatchId(id); setUserView('match_details'); }} />;
    }
  };

  const renderAdminContent = () => {
    switch (adminView) {
      case 'auth': return <AdminAuth onLogin={handleAdminLogin} users={users} />;
      case 'dashboard': return <AdminDashboard stats={{ users: users.length, matches: matches.length, pendingTx: transactions.filter(t => t.status === TransactionStatus.PENDING).length }} setView={setAdminView} onAddMatch={(m) => setMatches(prev => [m, ...prev])} />;
      case 'matches': return <AdminMatches matches={matches} setMatches={setMatches} onCancelMatch={handleCancelMatch} />;
      case 'transactions': return <AdminTransactions transactions={transactions} setTransactions={setTransactions} users={users} setUsers={setUsers} />;
      case 'winners': return <AdminWinners matches={matches} users={users} setMatches={setMatches} setUsers={setUsers} onCancelMatch={handleCancelMatch} />;
      case 'users': return <AdminUsers users={users} setUsers={setUsers} setTransactions={setTransactions} />;
      case 'settings': return <AdminSettings appConfig={appConfig} onUpdateConfig={setAppConfig} />;
      default: return <AdminDashboard stats={{ users: users.length, matches: matches.length, pendingTx: transactions.filter(t => t.status === TransactionStatus.PENDING).length }} setView={setAdminView} onAddMatch={(m) => setMatches(prev => [m, ...prev])} />;
    }
  };

  if (showSplash) return <SplashScreen logoUrl={appConfig.appLogoUrl} config={appConfig} />;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] shadow-2xl relative flex flex-col">
      <Toast {...toast} onClose={hideToast} />

      {showAuthSuccess && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
           <div className="bg-[#2D2F36] w-full max-w-xs rounded-2xl p-8 shadow-2xl text-center border border-white/10 animate-scale-in">
              <h2 className="text-white text-xl font-bold mb-2">Login Successful</h2>
              <p className="text-slate-400 text-sm mb-8">You have successfully logged in!</p>
              <button 
                onClick={handleAuthModalClose}
                className="w-full py-4 blue-gradient text-white rounded-xl font-bold text-sm tracking-wide active:scale-95 transition-all shadow-xl shadow-indigo-600/20"
              >
                OK
              </button>
           </div>
        </div>
      )}

      {isJoining && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
           <div className="bg-[#2D2F36] w-full max-w-[180px] rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl border border-white/10">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-100 text-xs font-bold tracking-widest uppercase">Joining...</p>
           </div>
        </div>
      )}

      {isAdmin ? (
        <>
          <AdminHeader onLogout={handleAdminLogout} />
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-32">{renderAdminContent()}</main>
          {isAdminLoggedIn && <AdminBottomNav activeView={adminView} setView={setAdminView} />}
        </>
      ) : (
        <>
          {userView !== 'match_details' && userView !== 'settings' && <Header config={appConfig} onNotifyClick={() => setUserView('notifications')} onLogoClick={handleLogoTap} />}
          <main className={`flex-1 overflow-y-auto ${userView === 'match_details' || userView === 'settings' ? '' : 'px-3 sm:px-4 pt-3 sm:pt-4 pb-28'}`}>{renderUserContent()}</main>
          {userView !== 'match_details' && userView !== 'auth' && userView !== 'settings' && <BottomNav activeView={userView} setView={setUserView} config={appConfig} />}
        </>
      )}
    </div>
  );
};

export default App;
