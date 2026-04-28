import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Cpu, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutProject = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans selection:bg-orange-500/30">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="bg-grid opacity-20"></div>
        <div className="glow-orb-orange opacity-10"></div>
        <div className="glow-orb-emerald opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 lg:py-20">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Operations</span>
        </motion.button>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Hero Section */}
          <motion.section variants={itemVariants} className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-slate-800 to-emerald-600 dark:from-orange-400 dark:via-slate-200 dark:to-green-500 pb-2">
              CrisisSync India
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The next generation of emergency management. Leveraging AI and real-time data to synchronize crisis response across the nation.
            </p>
          </motion.section>

          {/* Core Vision */}
          <motion.section variants={itemVariants} className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <Globe className="text-orange-500" />
                Our Mission
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                CrisisSync India was born from a simple yet powerful goal: to eliminate the chaos during critical emergencies. By integrating disparate data streams—from traffic patterns to responder availability—we provide a unified "Single Pane of Glass" for emergency dispatchers.
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-semibold shadow-sm">Real-time Telemetry</span>
                <span className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-semibold shadow-sm">AI Dispatch</span>
                <span className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-semibold shadow-sm">Predictive Analytics</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-emerald-500/10 rounded-3xl p-8 border border-white/20 dark:border-slate-800/50 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Shield size={120} />
               </div>
               <h3 className="text-xl font-bold mb-4">Core Principles</h3>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                   <div className="mt-1 h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                   <p className="text-sm">Reliability in low-bandwidth environments.</p>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                   <p className="text-sm">Privacy-first data handling and secure communication.</p>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                   <p className="text-sm">Open integration with municipal infrastructure.</p>
                 </li>
               </ul>
            </div>
          </motion.section>

          {/* Features Grid */}
          <motion.section variants={itemVariants} className="space-y-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Platform Capabilities</h2>
              <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <Zap />, title: "Live Simulation", desc: "Test emergency protocols in a risk-free digital twin environment." },
                { icon: <Users />, title: "Responder Management", desc: "Dynamic tracking and status monitoring of all field units." },
                { icon: <Cpu />, title: "AI Classification", desc: "Automated severity assessment of incoming distress reports." }
              ].map((f, i) => (
                <div key={i} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="text-orange-500 mb-4">{f.icon}</div>
                  <h4 className="font-bold text-lg mb-2">{f.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Meet the Team */}
          <motion.section variants={itemVariants} className="space-y-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Meet Team Alpha Coderss</h2>
              <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4 hover:border-orange-500/50 transition-all shadow-lg">
                 <div className="h-20 w-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg">S</div>
                 <div>
                    <h4 className="text-xl font-bold">Shivam Sony</h4>
                    <p className="text-orange-500 font-medium text-sm">Project Lead & Lead Developer</p>
                 </div>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">Architected the core synchronization engine and the high-fidelity operations dashboard.</p>
              </div>
              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4 hover:border-emerald-500/50 transition-all shadow-lg">
                 <div className="h-20 w-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg">SK</div>
                 <div>
                    <h4 className="text-xl font-bold">Shantanu Kumar</h4>
                    <p className="text-emerald-500 font-medium text-sm">Content Researcher & Documentation</p>
                 </div>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">Spearheaded the research on crisis protocols and crafted the technical documentation & presentation.</p>
              </div>
              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4 hover:border-blue-500/50 transition-all shadow-lg">
                 <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg">AK</div>
                 <div>
                    <h4 className="text-xl font-bold">Ashish Kumar</h4>
                    <p className="text-blue-500 font-medium text-sm">Data Contributor</p>
                 </div>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">Supported in providing the essential data streams and geographic information for the project.</p>
              </div>
            </div>
          </motion.section>

          {/* Technical Stack */}
          <motion.section variants={itemVariants} className="text-center p-12 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-8">Built with Precision</h2>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-lg font-bold">React 19</span>
                <span className="text-lg font-bold">Vite</span>
                <span className="text-lg font-bold">TailwindCSS</span>
                <span className="text-lg font-bold">Framer Motion</span>
                <span className="text-lg font-bold">Lucide Icons</span>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>

      {/* Footer with Copyright */}
      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 py-12 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <img src="/favicon.png" alt="CrisisSync Logo" className="h-10 w-10 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800" />
             <span className="font-bold tracking-wider uppercase text-sm">CrisisSync India</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © Alpha Coderss. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutProject;
