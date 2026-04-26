import React from 'react';
import { AlertCircle, Clock, MapPin, Search } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function IncidentCard({ incident, responders }) {
  const { id, type, location, affected, severity, status, assignedTo, timestamp } = incident;
  
  const responder = responders.find(r => r.id === assignedTo);

  const severityConfig = {
    critical: { color: 'text-red-600 dark:text-red-500', bg: 'bg-red-500/10', border: 'neon-border-red', label: 'CRITICAL' },
    high: { color: 'text-orange-600 dark:text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.15)]', label: 'HIGH' },
    medium: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.15)]', label: 'MEDIUM' },
    low: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-400/10', border: 'neon-border', label: 'LOW' }
  };

  const currentSev = severityConfig[severity] || severityConfig.low;

  return (
    <div className={cn("rounded-lg p-4 flex flex-col gap-3 border backdrop-blur-sm transition-all duration-300", currentSev.bg, currentSev.border)}>
      
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <AlertCircle size={18} className={`${currentSev.color} drop-shadow-sm dark:drop-shadow-[0_0_8px_currentColor]`} />
          <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{type} Emergency</span>
        </div>
        <span className={cn("text-[10px] px-2 py-1 rounded-full font-bold tracking-wider dark:drop-shadow-[0_0_5px_currentColor]", currentSev.color, "bg-slate-100 dark:bg-slate-950/50 border", currentSev.border)}>
          {currentSev.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <MapPin size={14} />
          <span>Zone <strong className="text-slate-800 dark:text-slate-200">{location}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <UsersIcon size={14} />
          <span><strong className="text-slate-800 dark:text-slate-200">{affected}</strong> affected</span>
        </div>
      </div>

      <div className="mt-2 pt-3 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center text-xs">
        {status === 'assigned' && responder ? (
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
             <span className="text-slate-600 dark:text-slate-300">
               En route: <span className="font-semibold text-blue-600 dark:text-blue-400">{responder.name}</span>
             </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-500">
             <Search size={14} />
             <span>Locating responder...</span>
          </div>
        )}
        
        <div className="flex items-center gap-1 text-slate-500">
          <Clock size={12} />
          <span>{Math.floor((Date.now() - timestamp) / 1000)}s ago</span>
        </div>
      </div>
    </div>
  );
}

function UsersIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export default IncidentCard;
