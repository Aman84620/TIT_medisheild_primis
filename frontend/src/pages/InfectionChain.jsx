import { useParams, Link } from 'react-router-dom';
import { getInfectionTrace, getPatients, inferRisk } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { GitBranch, User, Clock, MapPin, AlertCircle, ShieldCheck, ChevronRight, BrainCircuit, Activity } from 'lucide-react';
import TransitionWrapper from '../components/TransitionWrapper';

export default function InfectionChain() {
  const { id } = useParams();
  const { maskName } = useSettings();
  const [trace, setTrace] = useState([]);
  const [patient, setPatient] = useState(null);
  const [aiVerdict, setAiVerdict] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patients = await getPatients();
        const found = patients.find(p => p._id === id);
        setPatient(found);
        
        const data = await getInfectionTrace(id);
        setTrace(data);

        if (data.length > 0) {
          const inference = await inferRisk(data);
          setAiVerdict(inference);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Scanning Infection Vectors...</p>
    </div>
  );

  return (
    <TransitionWrapper>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="flex items-center justify-between bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <div className="flex items-center gap-6">
             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
               patient?.infectionStatus === 'Infected' ? 'bg-danger/10 text-danger' : 'bg-slate-100 text-slate-400'
             }`}>
               <User className="w-8 h-8" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{maskName(patient?.name) || 'Tracing Subject'}</h2>
               <p className="text-slate-500 flex items-center gap-2 text-sm mt-1">
                 <GitBranch className="w-4 h-4" /> Root Node for Transmission Chain
               </p>
             </div>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-400 uppercase tracking-widest">
             ID: {id?.slice(-6)}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             <h3 className="text-xl font-bold text-slate-800 px-2 flex items-center gap-2">
               <Clock className="w-5 h-5 text-primary" /> Historical Interaction Timeline
             </h3>
             
             <div className="space-y-4 relative before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
               {trace.length === 0 ? (
                 <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
                   No recorded interactions for this node.
                 </div>
               ) : (
                 trace.map((item, idx) => (
                   <div key={idx} className="relative pl-14 group">
                      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[54px] h-[54px] rounded-full border-4 border-slate-50 flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${
                        item.risk > 70 ? 'bg-danger text-white' : item.risk > 30 ? 'bg-warning text-white' : 'bg-safe text-white'
                      }`}>
                         <MapPin className="w-5 h-5" />
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                               Interaction with {maskName(item.contact)}
                               <ChevronRight className="w-4 h-4 text-slate-300" />
                            </h4>
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                              {new Date(item.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                         </div>
                         <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                            <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Risk: {item.risk}%</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              item.statusAtTime === 'Infected' ? 'bg-danger/10 text-danger' : 
                              item.statusAtTime === 'Medium Risk' ? 'bg-warning/10 text-warning' : 'bg-safe/10 text-safe'
                            }`}>
                              Contact Status: {item.statusAtTime}
                            </span>
                         </div>
                      </div>
                   </div>
                 ))
               )}
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group animate-scan">
                <div className="absolute inset-0 animate-scan opacity-20 pointer-events-none"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors"></div>
                
                <div className="flex items-center gap-2 mb-6">
                  <BrainCircuit className="w-5 h-5 text-primary" />
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">AI Inference Verdict</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="text-6xl font-black font-display tracking-tighter">
                    {aiVerdict?.score || 0}<span className="text-lg opacity-40 ml-2 font-sans tracking-normal">% Risk</span>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider tech-glow ${
                    aiVerdict?.classification === 'Critical' ? 'bg-danger text-white danger-glow' : 
                    aiVerdict?.classification === 'Warning' ? 'bg-warning text-slate-900' : 'bg-safe text-white'
                  }`}>
                    Status: {aiVerdict?.classification || 'Processing'}
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 space-y-3">
                   <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Model Confidence</span>
                      <span className="font-bold">{(aiVerdict?.confidence * 100).toFixed(0)}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(aiVerdict?.confidence * 100)}%` }}></div>
                   </div>
                </div>
             </div>

             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
                <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> Risk Factors
                </h4>
                <div className="space-y-4">
                   <FactorItem label="Duration Impact" value={aiVerdict?.factors?.durationImpact} />
                   <FactorItem label="Spatial Density" value={aiVerdict?.factors?.spatialDensity} />
                   <FactorItem label="Proximity Alert" active={aiVerdict?.factors?.proximityAlert} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </TransitionWrapper>
  );
}

function FactorItem({ label, value, active }) {
  return (
    <div className={`p-3 rounded-2xl border transition-colors ${active ? 'bg-danger/5 border-danger/10 text-danger' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
       <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider opacity-60">{label}</span>
          <span className="text-sm font-bold">{value || (active ? 'High' : 'Normal')}</span>
       </div>
    </div>
  );
}
