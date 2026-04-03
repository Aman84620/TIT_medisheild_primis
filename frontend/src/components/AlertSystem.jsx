import React, { useEffect, useState } from 'react';
import { getAlerts } from '../services/api';
import { Bell, AlertCircle, AlertTriangle, Info, Clock, X } from 'lucide-react';

export default function AlertSystem() {
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
      setUnread(data.length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="relative">
      <button 
        onClick={() => { setOpen(!open); setUnread(0); }}
        className="relative w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border border-white"></span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setOpen(false)}></div>
          <div className="absolute top-12 right-0 w-80 bg-white rounded-3xl border border-slate-100 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <header className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="font-bold text-slate-800">Intelligence Alerts</h3>
               <button onClick={() => setOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </header>
            
            <div className="max-h-96 overflow-auto py-2">
               {alerts.length === 0 ? (
                 <div className="px-6 py-10 text-center text-slate-400 text-sm">No new intelligence alerts.</div>
               ) : (
                  alerts.map(alert => (
                    <div key={alert.id} className="px-6 py-4 hover:bg-slate-50 transition-colors flex gap-4 items-start border-b border-slate-50 last:border-0 group cursor-pointer">
                       <div className={`mt-0.5 p-1.5 rounded-lg ${
                          alert.type === 'danger' ? 'bg-danger/10 text-danger' : 
                          alert.type === 'warning' ? 'bg-warning/10 text-warning' : 'bg-blue-100 text-blue-600'
                       }`}>
                          {alert.type === 'danger' ? <AlertCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 leading-snug">{alert.message}</p>
                          <div className="flex items-center gap-1.5 mt-2 opacity-40 group-hover:opacity-60 transition-opacity">
                             <Clock className="w-3 h-3" />
                             <span className="text-[10px] font-bold uppercase tracking-wider">{alert.time}</span>
                          </div>
                       </div>
                    </div>
                  ))
               )}
            </div>

            <footer className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
               <button className="text-primary text-xs font-bold hover:underline">View All Notifications</button>
            </footer>
          </div>
        </>
      )}
    </div>
  );
}
