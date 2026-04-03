import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ContactTracing from '../components/ContactTracing';
import PatientTracker from '../components/PatientTracker';
import HospitalMap from '../components/HospitalMap';
import Analytics from './Analytics';
import DiseaseSpread from './DiseaseSpread';
import InfectionChain from './InfectionChain';
import Settings from './Settings';
import AlertSystem from '../components/AlertSystem';
import { simulateInteraction, getAIModelCard } from '../services/api';
import TransitionWrapper from '../components/TransitionWrapper';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';
import { LayoutDashboard, Users, Activity, BarChart3, Settings as SettingsIcon, User, Zap, Play, Square, Search } from 'lucide-react';

export default function AdminDashboard() {
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    getAIModelCard().then(setModelInfo).catch(console.error);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">MS</span>
          </div>
          <h2 className="font-bold text-xl text-slate-800">MediShield <span className="text-primary">AI</span></h2>
        </div>
        
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Global search..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem to="/admin" icon={<LayoutDashboard />} label="Dashboard" />
          <SidebarItem to="/admin/patients" icon={<Users />} label="Patient Tracker" />
          <SidebarItem to="/admin/analytics" icon={<BarChart3 />} label="Analytics" />
          <SidebarItem to="/admin/spread" icon={<Zap />} label="Disease Spread" />
          <SidebarItem to="/admin/tracing" icon={<Activity />} label="Contact Tracing" />
        </nav>
        
        <div className="pt-4 border-t border-slate-200 mt-auto bg-slate-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-3xl">
           <SidebarItem to="/admin/settings" icon={<SettingsIcon />} label="Settings" />
           <div className="mt-4 flex flex-col gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl tech-glow">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse"></div>
               System: Active
             </div>
             <div className="text-slate-400 text-[9px] lowercase font-medium">
               Engine: {modelInfo?.name || 'MediShield-RNN V2.1'}
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
           <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Intelligence Dashboard</h1>
           <div className="flex items-center gap-6">
             <AlertSystem />
             <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 overflow-hidden">
               <User className="text-slate-500 w-5 h-5"/>
             </div>
           </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 relative">
            <Routes>
              <Route path="/" element={<TransitionWrapper><DashboardStats /></TransitionWrapper>} />
              <Route path="/patients" element={<TransitionWrapper><PatientTracker /></TransitionWrapper>} />
              <Route path="/analytics" element={<TransitionWrapper><Analytics /></TransitionWrapper>} />
              <Route path="/spread" element={<TransitionWrapper><DiseaseSpread /></TransitionWrapper>} />
              <Route path="/trace/:id" element={<TransitionWrapper><InfectionChain /></TransitionWrapper>} />
              <Route path="/settings" element={<TransitionWrapper><Settings /></TransitionWrapper>} />
              <Route path="/tracing" element={
                 <TransitionWrapper>
                   <div className="h-[600px]">
                      <ContactTracing />
                   </div>
                 </TransitionWrapper>
              } />
            </Routes>
        </div>
      </main>
    </div>
  );
}

function DashboardStats() {
  const [isSimulating, setIsSimulating] = useState(false);
  const { maskName } = useSettings();

  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(async () => {
        try {
          const res = await simulateInteraction();
          if (res.data.interaction) {
            toast.success(`New Interaction in ${res.data.interaction.location}`, {
              icon: '🛡️',
              style: { border: '1px solid #3b82f6' }
            });
          }
        } catch (err) {
          console.error(err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <>
       <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">System Overview</h2>
            <p className="text-slate-500 mt-1">Real-time surveillance across all hospital departments.</p>
          </div>
          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${
              isSimulating ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-primary text-white shadow-primary/20'
            }`}
          >
            {isSimulating ? <><Square className="w-5 h-5" /> Stop Simulation</> : <><Play className="w-5 h-5" /> Start Live Simulation</>}
          </button>
       </div>

       <div className="grid grid-cols-3 gap-6 mb-8">
          {/* KPI Cards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
             <h3 className="text-slate-500 font-medium mb-2">Total Patients Tracked</h3>
             <div className="text-4xl font-bold text-slate-800">1,204</div>
             <div className="mt-4 text-safe text-sm font-medium">↑ 12% from last week</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-danger"></div>
             <h3 className="text-slate-500 font-medium mb-2">Active High-Risk Cases</h3>
             <div className="text-4xl font-bold text-slate-800">18</div>
             <div className="mt-4 text-danger text-sm font-medium">↑ 4 new today</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-warning"></div>
             <h3 className="text-slate-500 font-medium mb-2">Zones on Alert</h3>
             <div className="text-4xl font-bold text-slate-800">2</div>
             <div className="mt-4 text-slate-500 text-sm font-medium">ICU-A, Ward-3</div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Map Area */}
          <div className="min-h-[500px]">
             <HospitalMap />
          </div>
          {/* Chart Area */}
          <div className="min-h-[500px]">
             <ContactTracing />
          </div>
       </div>
    </>
  );
}

function SidebarItem({ icon, label, to }) {
  const location = useLocation();
  const active = location.pathname === to;
  
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${active ? 'bg-primary/10 text-primary font-medium' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
      {React.cloneElement(icon, { className: "w-5 h-5" })}
      <span>{label}</span>
    </Link>
  );
}
