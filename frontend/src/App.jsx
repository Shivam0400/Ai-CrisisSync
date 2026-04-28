import React, { useEffect, useState, useRef } from 'react';
import { Activity, ShieldAlert, Users, Layers, Zap, Lock, Sun, Moon } from 'lucide-react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SystemMap from './components/SystemMap';
import RespondersView from './components/RespondersView';
import SimulationsView from './components/SimulationsView';
import AdminPanel from './components/AdminPanel';
import AboutProject from './components/AboutProject';

function App() {
  const navigate = useNavigate();
  const [data, setData] = useState({ incidents: [], responders: [], locations: {} });
  const [isPolling, setIsPolling] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const prevIncidentsRef = useRef([]);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const addNotification = (message) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10);
    
    setNotifications(prev => {
      // Prevent stacking the exact same message if it's already visible
      if (prev.some(n => n.message === message)) {
        return prev;
      }
      return [...prev, { id, message }];
    });

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  useEffect(() => {
    const prev = prevIncidentsRef.current;
    const current = data.incidents;

    current.forEach(currInc => {
      const prevInc = prev.find(p => p.id === currInc.id);
      
      if (!prevInc) {
        // It's a brand new incident!
        addNotification(`CRISIS ALERT: ${currInc.severity.toUpperCase()} ${currInc.type} emergency reported at ${currInc.location}.`);
        if (currInc.status === 'assigned') {
           const responderName = data.responders.find(r => r.id === currInc.assignedTo)?.name || 'Unit';
           setTimeout(() => addNotification(`Dispatch: ${responderName} is en route to ${currInc.location}.`), 300);
        }
      } else {
        // Check for state changes in existing incidents
        if (prevInc.status === 'pending' && currInc.status === 'assigned') {
          const responderName = data.responders.find(r => r.id === currInc.assignedTo)?.name || 'Unit';
          addNotification(`Dispatch: ${responderName} is en route to ${currInc.location}.`);
        }
        
        if (prevInc.status !== 'resolved' && currInc.status === 'resolved') {
          const responderName = data.responders.find(r => r.id === currInc.assignedTo)?.name || 'Unit';
          addNotification(`Resolved: Emergency at ${currInc.location} was handled by ${responderName}.`);
        }
      }
    });

    prevIncidentsRef.current = current;
  }, [data.incidents, data.responders]);

  useEffect(() => {
    let interval;
    if (isPolling) {
      interval = setInterval(() => {
        fetch('/api/status')
          .then(res => res.json())
          .then(json => setData(json))
          .catch(err => console.error('Failed to fetch status:', err));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPolling]);

  // Initial fetch
  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  return (
    <Routes>
      <Route path="/about" element={<AboutProject />} />
      <Route path="/" element={
        <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 relative transition-colors duration-300">
          {/* --- Animated Cyberpunk Background --- */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="bg-grid"></div>
            <div className="scanner-line"></div>
            <div className="glow-orb-orange"></div>
            <div className="glow-orb-emerald"></div>
          </div>

          {/* Sidebar Navigation */}
          <aside className="w-full md:w-20 lg:w-64 border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 md:bg-white/50 md:dark:bg-slate-900/50 flex flex-row md:flex-col items-center lg:items-start p-2 md:p-4 shrink-0 transition-all duration-300 backdrop-blur-md z-50 order-last md:order-first justify-around md:justify-start pb-4 md:pb-4 neon-border">
            <div className="hidden md:flex items-center gap-3 mb-12">
              <img src="/favicon.png" alt="CrisisSync India Logo" className="h-10 w-10 shrink-0 drop-shadow-[0_0_12px_rgba(249,115,22,0.4)] object-contain" />
              <h1 className="text-xl font-bold tracking-wider hidden lg:block uppercase bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-slate-800 to-emerald-600 dark:from-orange-400 dark:via-slate-200 dark:to-green-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)] dark:drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                CrisisSync India
              </h1>
            </div>
            
            <nav className="flex flex-row md:flex-col gap-2 md:gap-6 w-full justify-around md:justify-start">
              <NavItem icon={<ShieldAlert />} label="Live Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
              <NavItem icon={<Layers />} label="System Map" active={activeTab === 'system-map'} onClick={() => setActiveTab('system-map')} />
              <NavItem icon={<Users />} label="Responders" active={activeTab === 'responders'} onClick={() => setActiveTab('responders')} />
              <NavItem icon={<Zap />} label="Simulations" active={activeTab === 'simulations'} onClick={() => setActiveTab('simulations')} />
              <NavItem icon={<Lock />} label="Admin Access" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
            </nav>

            <div className="mt-auto hidden lg:flex flex-col text-xs text-slate-500 dark:text-slate-500 gap-1 w-full p-2 border-t border-slate-200 dark:border-slate-800 pt-4">
              <p>System Status: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Online</span></p>
              <p>Server Link: Connected</p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 h-full overflow-y-auto p-4 lg:p-8 relative z-10 pb-20 md:pb-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white neon-text">Operations Control</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Real-time emergency monitoring and dispatch.</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button 
                  onClick={() => setIsPolling(!isPolling)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors neon-border ${
                    isPolling ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)] neon-text' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isPolling ? 'Live Sync Active' : 'Sync Paused'}
                </button>
                <button 
                  onClick={() => navigate('/about')}
                  className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center neon-border shadow-lg hover:border-orange-500 transition-colors group cursor-pointer"
                  title="About Project"
                >
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 neon-text group-hover:text-orange-500">OP</span>
                </button>
              </div>
            </header>

            {activeTab === 'dashboard' && <Dashboard incidents={data.incidents} responders={data.responders} locations={data.locations} />}
            {activeTab === 'system-map' && <SystemMap incidents={data.incidents} responders={data.responders} locations={data.locations} />}
            {activeTab === 'responders' && <RespondersView responders={data.responders} />}
            {activeTab === 'simulations' && <SimulationsView incidents={data.incidents} locations={data.locations} />}
            {activeTab === 'admin' && <AdminPanel locations={data.locations} />}
          </main>

          {/* Toast Notifications */}
          <div className="fixed top-4 md:top-auto md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-3 pointer-events-none">
            {notifications.map(n => (
              <div key={n.id} className="bg-white dark:bg-slate-900 border-l-4 border-emerald-500 text-slate-800 dark:text-slate-200 p-3 md:p-4 rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-fade-in-down max-w-xs md:max-w-sm pointer-events-auto text-sm md:text-base transition-colors">
                {n.message}
              </div>
            ))}
          </div>
        </div>
      } />
    </Routes>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center md:justify-start gap-0 md:gap-4 w-full p-2 md:p-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 md:border md:border-blue-200 md:dark:border-blue-500/20 md:shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
    }`}>
      <span className={active ? '' : 'group-hover:scale-110 transition-transform'}>{icon}</span>
      <span className="font-medium hidden lg:block">{label}</span>
    </button>
  );
}

export default App;
