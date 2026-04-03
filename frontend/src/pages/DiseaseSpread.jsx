import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { getAnalyticsSpread, runPrediction } from '../services/api';
import { Play, TrendingUp, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import TransitionWrapper from '../components/TransitionWrapper';
import toast from 'react-hot-toast';

export default function DiseaseSpread() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);

  const fetchData = async () => {
    try {
      const spread = await getAnalyticsSpread();
      setData(spread);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePredict = async () => {
    setPredicting(true);
    const toastId = toast.loading("Processing AI Prevention Model...");
    try {
      await runPrediction();
      toast.success("New forecast generated and applied.", { id: toastId });
      fetchData();
    } catch (err) {
      toast.error("Forecasting service unavailable.", { id: toastId });
    } finally {
      setPredicting(false);
    }
  };

  return (
    <TransitionWrapper>
      <div className="space-y-8 animate-in fade-in duration-700">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Disease Spread Analysis</h2>
            <p className="text-slate-500 mt-1">Multi-vector analysis of infection transmission and future forecasts.</p>
          </div>
          <button 
            onClick={handlePredict}
            disabled={predicting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            {predicting ? 'Processing AI...' : <><Play className="w-5 h-5" /> Run Forecast</>}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <TrendingUp className="w-5 h-5 text-primary" /> Transmission Forecast (7 Days)
              </h3>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={data}>
                      <defs>
                         <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                         </linearGradient>
                         <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                         contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="top" align="right" iconType="circle" />
                      <Area type="monotone" dataKey="actual" name="Reported Cases" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                      <Area type="monotone" dataKey="predicted" name="AI Prediction" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPred)" />
                   </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
                 <h4 className="font-bold text-slate-800 mb-4 tracking-tight">Outbreak Probability</h4>
                 <div className="flex flex-col items-center py-6">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-warning" strokeDasharray="364.4" strokeDashoffset="100" strokeLinecap="round" />
                       </svg>
                       <span className="absolute text-2xl font-black text-slate-800">72%</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 uppercase font-bold tracking-widest text-center">Current Warning Level</p>
                 </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-blue-700 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:bg-white/20 transition-all duration-700"></div>
                 <h4 className="font-bold mb-4 flex items-center gap-2">
                   <Zap className="w-5 h-5 text-warning fill-warning" />
                   Prevention Insights
                 </h4>
                 <ul className="space-y-4 text-sm opacity-90 leading-relaxed font-medium">
                    <li className="flex gap-3">
                       <ShieldCheck className="w-5 h-5 flex-shrink-0 text-safe-200" />
                       <span>Immediate isolation of Ward-3 contacts reduces risk by 45%.</span>
                    </li>
                    <li className="flex gap-3">
                       <AlertTriangle className="w-5 h-5 flex-shrink-0 text-warning-200" />
                       <span>Increased interaction density detected in Wing-B Cafeteria.</span>
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      </div>
    </TransitionWrapper>
  );
}
