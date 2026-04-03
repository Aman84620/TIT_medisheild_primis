import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, AreaChart, Area
} from 'recharts';
import { getPatients, getAnalyticsSpread, getZoneData } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import TransitionWrapper from '../components/TransitionWrapper';
import { Activity, TrendingUp, Users, Download, ShieldCheck } from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

export default function Analytics() {
  const [patientData, setPatientData] = useState([]);
  const [spreadData, setSpreadData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { maskName } = useSettings();

  const fetchData = async () => {
    try {
      const [patients, spread, zones] = await Promise.all([
        getPatients(),
        getAnalyticsSpread(),
        getZoneData()
      ]);
      setPatientData(patients);
      setSpreadData(spread);
      
      const formattedZones = Object.entries(zones).map(([name, stats]) => ({
        name,
        patients: stats.patients,
        infected: stats.infected
      }));
      setZoneData(formattedZones);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Intelligence Analytics...</div>;

  const totalInfected = patientData.filter(p => p.infectionStatus === 'Infected').length;

  return (
    <TransitionWrapper>
      <div className="space-y-8 animate-in fade-in duration-700">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Intelligence Analytics</h2>
            <p className="text-slate-500 mt-1">Cross-sector data analysis and transmission forensics.</p>
          </div>
          <button 
            onClick={() => alert('Generating Intelligence Report...')}
            className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
            Export Data
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <KPICard title="Transmission rate" value="1.2" trend="+0.1" color="text-danger" />
           <KPICard title="Total Infected" value={totalInfected} trend="Active" color="text-danger" />
           <KPICard title="Model Accuracy" value="94.2%" trend="+1.2%" color="text-primary" />
           <KPICard title="Active Nodes" value={patientData.length} trend="Total" color="text-slate-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Infection Spread Forecast
              </h3>
              <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={spreadData}>
                       <XAxis dataKey="name" hide />
                       <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                       <Area type="monotone" dataKey="actual" name="Reported" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={3} />
                       <Area type="monotone" dataKey="predicted" name="AI Forecast" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.05} strokeWidth={3} strokeDasharray="5 5" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-warning" /> Sector-wise Distribution
              </h3>
              <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={zoneData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                       <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                       <Bar dataKey="patients" name="Total Patients" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                       <Bar dataKey="infected" name="Infected" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> At-Risk Subjects Identified
              </h3>
              <div className="space-y-4">
                 {patientData.filter(p => p.infectionStatus !== 'Safe').slice(0, 5).map(p => (
                   <div key={p._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-4">
                         <div className={`w-2 h-2 rounded-full ${p.infectionStatus === 'Infected' ? 'bg-danger' : 'bg-warning'}`}></div>
                         <span className="font-bold text-slate-800">{maskName(p.name)}</span>
                      </div>
                      <div className="flex items-center gap-6">
                         <span className="text-xs text-slate-400 font-mono">{p._id.slice(-6)}</span>
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{p.currentZone}</span>
                      </div>
                   </div>
                 ))}
                 {patientData.filter(p => p.infectionStatus !== 'Safe').length === 0 && (
                   <div className="text-center py-8 text-slate-400 text-sm italic">No active risk vectors identified in system.</div>
                 )}
              </div>
           </div>

           <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">AI Safety Verdict</h4>
              <p className="text-lg leading-relaxed font-medium mb-8">
                Current cluster detection suggests a <span className="text-primary font-black underline underline-offset-4 decoration-2">stable plateau</span> in most monitored sectors. 
              </p>
              <div className="flex gap-4">
                 <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-black text-primary">02</div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold">New Vectors</div>
                 </div>
                 <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-black text-safe">8.4</div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Safety Index</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </TransitionWrapper>
  );
}

function KPICard({ title, value, trend, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
       <div className={`text-3xl font-black ${color} mb-1`}>{value}</div>
       <p className="text-xs font-bold opacity-60">{trend}</p>
    </div>
  );
}
