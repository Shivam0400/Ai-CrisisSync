import React from 'react';
import ReportingForm from './ReportingForm';
import InteractiveMap from './InteractiveMap';
import IncidentCard from './IncidentCard';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

function Dashboard({ incidents, responders, locations }) {
  const activeIncidents = incidents.filter(i => i.status !== 'resolved');
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved');
  const criticalCount = activeIncidents.filter(i => i.severity === 'critical').length;
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left Column: Form and Stats */}
      <div className="space-y-6 xl:col-span-1">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between neon-border shadow-md dark:shadow-lg transition-all hover:shadow-[0_5px_20px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">Active Alerts</p>
              <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{activeIncidents.length}</p>
            </div>
            <div className={`p-3 rounded-full neon-text ${criticalCount > 0 ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between neon-border-emerald shadow-md dark:shadow-lg transition-all hover:shadow-[0_5px_20px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <div>
               <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">Resolved</p>
               <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{resolvedIncidents.length}</p>
            </div>
            <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-500 neon-text">
               <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        {/* Reporting Form */}
        <ReportingForm locations={locations} />
      </div>

      {/* Middle/Right Column: Map and Incidents list */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        {/* Map Section */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-xl p-6 neon-border shadow-md dark:shadow-none transition-all hover:shadow-[0_5px_25px_rgba(59,130,246,0.15)] dark:hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 neon-text">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_currentColor]"></span>
              Live Tracking Map
            </h3>
            <div className="flex gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Critical</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"></span> Responder</span>
            </div>
          </div>
          <div className="h-[350px] md:aspect-video w-full bg-slate-100 dark:bg-slate-950 rounded-lg relative overflow-hidden flex items-center justify-center p-4 border border-slate-200 dark:border-transparent">
            <InteractiveMap incidents={incidents} responders={responders} locations={locations} />
          </div>
        </div>

        {/* Active Incidents List */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-xl p-4 neon-border shadow-md dark:shadow-none flex-1 min-h-[300px]">
          <h3 className="text-lg font-semibold mb-4 px-2 neon-text">Active Encounters</h3>
          {activeIncidents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500 gap-2">
              <ShieldCheck size={32} className="text-emerald-500/50" />
              <p>No active incidents. Situation normal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sort critical first */}
              {[...activeIncidents]
                .sort((a,b) => {
                   const sevMap = { critical: 4, high: 3, medium: 2, low: 1 };
                   return sevMap[b.severity] - sevMap[a.severity];
                })
                .map(inc => (
                <IncidentCard key={inc.id} incident={inc} responders={responders} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
