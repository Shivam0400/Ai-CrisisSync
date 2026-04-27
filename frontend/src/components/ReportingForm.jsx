import React, { useState } from 'react';
import { Send, AlertOctagon } from 'lucide-react';

function ReportingForm({ locations }) {
  const [formData, setFormData] = useState({
    type: 'medical',
    location: 'Tilkamanjhi',
    affected: 1,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      // Reset form on success
      setFormData(prev => ({ ...prev, affected: 1, notes: '' }));
    } catch (err) {
      console.error('Failed to report incident:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-xl p-5 neon-border-red shadow-md dark:shadow-none transition-all relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500"></div>

      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-red-500/10 text-red-600 dark:text-red-500 rounded-lg">
          <AlertOctagon size={20} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white neon-text">Report Emergency</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Emergency Type</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
            >
              <option value="medical">Medical</option>
              <option value="security">Security</option>
              <option value="fire">Fire / Hazard</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Zone / Area</label>
            <select 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
            >
              {locations && Object.keys(locations).map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">People Affected</label>
          <input 
            type="number" 
            min="1"
            value={formData.affected}
            onChange={(e) => setFormData({...formData, affected: parseInt(e.target.value) || 0})}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Additional Notes</label>
          <textarea 
            rows="2"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none resize-none"
            placeholder="Important details..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="mt-2 w-full flex items-center justify-center gap-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-500/50 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Transmitting...' : 'Dispatch Protocol'}
          <Send size={16} />
        </button>

      </form>
    </div>
  );
}

export default ReportingForm;
