import React from 'react';
import InteractiveMap from './InteractiveMap';
import { Layers, MapPin, AlertTriangle } from 'lucide-react';

function SystemMap({ incidents, responders, locations }) {
  const activeIncidents = incidents.filter(i => i.status !== 'resolved');
  
  // Get unique zones with active incidents
  const affectedZones = [...new Set(activeIncidents.map(i => i.location))].sort();

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
          <Layers size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">System Map</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Detailed grid analysis and zone status.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
        {/* Main Map Area */}
        <div className="lg:col-span-3 bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-xl p-6 neon-border shadow-md dark:shadow-none transition-all flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-semibold flex items-center gap-2 neon-text">
               Sector Alpha Grid
             </h3>
             <div className="flex items-center gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]"></span> Incident</span>
               <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></span> Responder</span>
             </div>
          </div>
          <div className="flex-1 bg-slate-100 dark:bg-slate-950 rounded-lg relative overflow-hidden flex items-center justify-center p-8 border border-slate-200 dark:border-transparent">
             {/* Scale up the InteractiveMap for this view */}
             <div className="w-full h-full min-h-[400px] md:min-h-[600px] flex items-center justify-center">
               <InteractiveMap incidents={incidents} responders={responders} locations={locations} />
             </div>
          </div>
        </div>

        {/* Zone Details Sidebar */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-xl p-6 neon-border shadow-md dark:shadow-none flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 neon-text">
            <MapPin size={18} className="text-blue-500 dark:text-blue-400" />
            Affected Zones
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {affectedZones.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-500 mt-10">
                All zones secure.
              </div>
            ) : (
              affectedZones.map(zone => {
                const zoneIncidents = activeIncidents.filter(i => i.location === zone);
                const hasCritical = zoneIncidents.some(i => i.severity === 'critical');
                
                return (
                  <div key={zone} className={`p-4 rounded-lg border ${hasCritical ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg text-slate-800 dark:text-white">{zone}</span>
                      {hasCritical && <AlertTriangle size={16} className="text-red-500" />}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                      <p>Active Alerts: <strong className="text-slate-700 dark:text-slate-200">{zoneIncidents.length}</strong></p>
                      <p>Types: {zoneIncidents.map(i => i.type).join(', ')}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemMap;
