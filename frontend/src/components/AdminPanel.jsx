import React, { useState } from 'react';
import { Lock, ShieldCheck, UserPlus, AlertCircle } from 'lucide-react';

function AdminPanel({ locations }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'security',
    location: locations && Object.keys(locations).length > 0 ? Object.keys(locations)[0] : ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Access Code');
      setPassword('');
    }
  };

  const handleAddResponder = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/responders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccessMsg('Responder successfully deployed to the field.');
        setFormData({ ...formData, name: '' }); // reset name only
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to deploy responder. System offline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-xl max-w-md w-full relative overflow-hidden">
          {/* Cyberpunk Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 shadow-[0_0_15px_rgba(239,68,68,0.1)] dark:shadow-[0_0_15px_rgba(239,68,68,0.2)] text-slate-600 dark:text-slate-300">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-widest">Admin Terminal</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">Restricted Access. Authentication Required.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="Enter Passcode..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 p-3 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-center tracking-widest font-mono"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm justify-center">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded transition-colors uppercase tracking-wider text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} />
              Authorize Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-wider">Command Center</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Deploy new field units to active zones.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm underline transition-colors"
        >
          Lock Terminal
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-md dark:shadow-lg relative overflow-hidden">
        {/* Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <UserPlus size={20} className="text-emerald-600 dark:text-emerald-500" />
          Deploy New Responder Unit
        </h3>

        <form onSubmit={handleAddResponder} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unit Name/Callsign</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Charlie (Med)"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 p-3 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Specialization</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 p-3 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              >
                <option value="security">Security / Police</option>
                <option value="medical">Medical / EMS</option>
                <option value="fire">Fire / Rescue</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Initial Deployment Zone</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 p-3 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              >
                {locations && Object.keys(locations).map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-sm text-center">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded transition-colors uppercase tracking-widest disabled:opacity-50"
          >
            {isSubmitting ? 'Deploying...' : 'Deploy Unit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
