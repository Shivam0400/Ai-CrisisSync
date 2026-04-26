import React from 'react';
import { Users, Shield, PlusSquare, MapPin, Activity } from 'lucide-react';
import { cn } from './IncidentCard';

function RespondersView({ responders }) {
  const availableCount = responders.filter(r => r.status === 'available').length;
  const busyCount = responders.filter(r => r.status === 'busy').length;

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
          <Users size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Responder Directory</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage and monitor active field units.</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 p-6 rounded-3xl flex items-center justify-between shadow-2xl transition-all duration-500 hover:bg-white/60 dark:hover:bg-slate-900/60">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Total Units</p>
            <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white tabular-nums">{responders.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500">
            <Users size={28} />
          </div>
        </div>
        <div className="group bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 p-6 rounded-3xl flex items-center justify-between shadow-2xl transition-all duration-500 hover:bg-white/60 dark:hover:bg-slate-900/60">
          <div>
             <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Ready Status</p>
             <p className="text-3xl font-black mt-1 text-emerald-600 dark:text-emerald-400 tabular-nums">{availableCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-500">
             <Shield size={28} />
          </div>
        </div>
        <div className="group bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 p-6 rounded-3xl flex items-center justify-between shadow-2xl transition-all duration-500 hover:bg-white/60 dark:hover:bg-slate-900/60">
          <div>
             <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Active Duty</p>
             <p className="text-3xl font-black mt-1 text-amber-600 dark:text-amber-400 tabular-nums">{busyCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-500">
             <Activity size={28} />
          </div>
        </div>
      </div>

      {/* Responders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 overflow-y-auto pb-8 pt-2 px-2 -mx-2">
        {responders.map(responder => {
          const isMedical = responder.type === 'medical';
          const isAvailable = responder.status === 'available';
          
          return (
            <div key={responder.id} className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[2rem] p-6 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-2xl dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              
              {/* Animated Glow Overlay */}
              <div className={cn(
                "absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl",
                isAvailable ? "bg-emerald-500" : "bg-amber-500"
              )}></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "p-4 rounded-2xl shadow-inner transition-transform duration-500 group-hover:rotate-6",
                    isMedical ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    {isMedical ? <PlusSquare size={24} /> : <Shield size={24} />}
                  </div>
                  <div className={cn(
                    "flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest border transition-all duration-500 group-hover:px-4", 
                    isAvailable 
                      ? "text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/20 dark:group-hover:bg-emerald-500/20" 
                      : "text-amber-700 dark:text-amber-400 bg-amber-500/5 border-amber-500/20 dark:group-hover:bg-amber-500/20"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                      isAvailable ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                    )}></span>
                    {responder.status === 'busy' ? 'On Duty' : 'Ready'}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight leading-none mb-1 group-hover:text-blue-500 transition-colors duration-300">
                    {responder.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.1em]">
                    {responder.type} Division
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-6 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter opacity-60">Deployment Zone</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{responder.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-[9px] font-black font-mono text-slate-400 uppercase">
                      ID: {responder.id}
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10"></div>
                      <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10"></div>
                      <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RespondersView;
