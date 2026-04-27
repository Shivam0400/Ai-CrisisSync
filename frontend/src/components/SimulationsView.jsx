import React, { useState } from 'react';
import { Zap, Play, AlertOctagon, Activity, Server, Database } from 'lucide-react';
import { cn } from './IncidentCard';

function SimulationsView({ incidents }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [{ id: Date.now(), message, type, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 50));
  };

  const triggerRandomIncident = async () => {
    setIsSimulating(true);
    addLog('Generating random simulation data...', 'info');
    
    const types = ['medical', 'security', 'fire'];
    const locationKeys = typeof locations !== 'undefined' && locations ? Object.keys(locations) : ['Tilkamanjhi', 'Sabour', 'Nathnagar', 'Barari'];
    const type = types[Math.floor(Math.random() * types.length)];
    const location = locationKeys[Math.floor(Math.random() * locationKeys.length)];
    const affected = Math.floor(Math.random() * 12) + 1;

    try {
      addLog(`Transmitting payload to core server...`, 'info');
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, location, affected, notes: 'Automated Simulation Drill' })
      });
      
      if (res.ok) {
        addLog(`SUCCESS: ${type.toUpperCase()} emergency triggered at Zone ${location}`, 'success');
      } else {
        addLog('ERROR: Payload rejected by server.', 'error');
      }
    } catch (err) {
      addLog(`ERROR: Connection failed. ${err.message}`, 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
          <Zap size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">System Simulations</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Run drills and test automated dispatch logic.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        {/* Controls Section */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-md dark:shadow-lg relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute -right-10 -top-10 opacity-[0.03] dark:opacity-5 pointer-events-none text-slate-900 dark:text-white">
               <Server size={200} />
             </div>

             <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-slate-800 dark:text-slate-100">
               <Activity size={18} className="text-purple-600 dark:text-purple-400" />
               Stress Test Protocol
             </h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
               Inject synthetic emergency data into the live system to verify AI response times and routing algorithms.
             </p>

             <button 
               onClick={triggerRandomIncident}
               disabled={isSimulating}
               className="w-full relative group overflow-hidden rounded-lg p-[1px]"
             >
               <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-lg opacity-30 dark:opacity-70 group-hover:opacity-60 dark:group-hover:opacity-100 transition-opacity duration-300"></span>
               <div className="relative bg-white dark:bg-slate-950 px-6 py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-slate-50 dark:group-hover:bg-slate-900/50">
                 {isSimulating ? (
                   <>
                     <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                     <span className="font-bold text-purple-600 dark:text-purple-300 tracking-wider">INJECTING DATA...</span>
                   </>
                 ) : (
                   <>
                     <Play fill="currentColor" size={18} className="text-purple-600 dark:text-purple-400" />
                     <span className="font-bold text-slate-800 dark:text-white tracking-wider">TRIGGER RANDOM INCIDENT</span>
                   </>
                 )}
               </div>
             </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-md dark:shadow-lg flex-1">
             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-300">
               <Database size={18} />
               System Integrity
             </h3>
             <div className="space-y-4">
               <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                 <span className="text-sm text-slate-500 dark:text-slate-400">Total Processed</span>
                 <span className="font-mono text-emerald-600 dark:text-emerald-400">{incidents.length}</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                 <span className="text-sm text-slate-400">Resolution Rate</span>
                 <span className="font-mono text-blue-400">
                   {incidents.length > 0 
                     ? Math.round((incidents.filter(i => i.status === 'resolved').length / incidents.length) * 100) 
                     : 0}%
                 </span>
               </div>
             </div>
          </div>
        </div>

        {/* Console / Terminal Section */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-0 shadow-md dark:shadow-lg flex flex-col font-mono overflow-hidden">
          <div className="bg-slate-200 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 p-3 flex gap-2 items-center">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-500 ml-2 tracking-widest uppercase">System Console</span>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs text-slate-800 dark:text-slate-200">
            {logs.length === 0 ? (
              <div className="text-slate-400 dark:text-slate-600">Waiting for input...</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex gap-3 items-start animate-fade-in-down">
                  <span className="text-slate-400 dark:text-slate-500 shrink-0">[{log.time}]</span>
                  <span className={cn(
                    "break-all",
                    log.type === 'error' && "text-red-500 dark:text-red-400",
                    log.type === 'success' && "text-emerald-600 dark:text-emerald-400",
                    log.type === 'info' && "text-blue-600 dark:text-blue-300"
                  )}>
                    {log.type === 'error' ? '> ERR: ' : '> '}{log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SimulationsView;
