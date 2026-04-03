import React, { useEffect, useState } from 'react';
import { getZoneData } from '../services/api';
import { Map, Users, AlertCircle } from 'lucide-react';

export default function HospitalMap() {
  const [zones, setZones] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getZoneData();
      setZones(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getZoneColor = (risk) => {
    if (risk === 'high') return 'fill-danger/20 stroke-danger';
    if (risk === 'medium') return 'fill-warning/20 stroke-warning';
    return 'fill-safe/10 stroke-safe';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Map className="w-6 h-6 text-primary" /> Live Hospital Floor Plan
          </h3>
          <p className="text-sm text-slate-500 mt-1">Real-time occupancy and risk distribution by zone.</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <div className="w-2 h-2 rounded-full bg-safe"></div> Low Risk
           </div>
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <div className="w-2 h-2 rounded-full bg-warning"></div> Elevated
           </div>
           <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <div className="w-2 h-2 rounded-full bg-danger"></div> High Risk
           </div>
        </div>
      </div>

      <div className="flex-1 relative min-h-[350px] lg:min-h-[400px] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 800 500" className="w-full h-auto max-h-full drop-shadow-2xl">
          {/* Main Corridor */}
          <rect x="50" y="200" width="700" height="100" rx="10" className="fill-slate-50 stroke-slate-200 stroke-2" />
          <text x="400" y="255" textAnchor="middle" className="fill-slate-300 text-[10px] font-bold uppercase tracking-widest">Main Corridor</text>

          {/* ICU-A */}
          <ZoneRect 
            x={50} y={50} width={250} height={130} 
            name="ICU-A" 
            stats={zones['ICU-A']} 
            colorClass={getZoneColor(zones['ICU-A']?.risk)} 
          />

          {/* Ward-3 */}
          <ZoneRect 
            x={320} y={50} width={430} height={130} 
            name="Ward-3" 
            stats={zones['Ward-3']} 
            colorClass={getZoneColor(zones['Ward-3']?.risk)} 
          />

          {/* ER */}
          <ZoneRect 
            x={50} y={320} width={350} height={130} 
            name="Emergency Room (ER)" 
            stats={zones['ER']} 
            colorClass={getZoneColor(zones['ER']?.risk)} 
          />

          {/* Cafeteria */}
          <ZoneRect 
            x={420} y={320} width={330} height={130} 
            name="Cafeteria" 
            stats={zones['Cafeteria']} 
            colorClass={getZoneColor(zones['Cafeteria']?.risk)} 
          />
        </svg>

        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
}

function ZoneRect({ x, y, width, height, name, stats, colorClass }) {
  return (
    <g className="group cursor-help transition-all duration-500">
      <title>{`${name}: ${stats?.patients || 0} Patients (${stats?.infected || 0} Infected)`}</title>
      <rect 
        x={x} y={y} width={width} height={height} rx="15" 
        className={`${colorClass} stroke-2 transition-all duration-500 group-hover:stroke-[3px] group-hover:fill-current group-hover:bg-opacity-30`} 
      />
      <text x={x + 20} y={y + 35} className="fill-slate-800 font-bold text-sm tracking-tight">{name}</text>
      
      <g transform={`translate(${x + 20}, ${y + 55})`}>
        <circle cx="0" cy="5" r="3" className={stats?.infected > 0 ? "fill-danger animate-pulse" : "fill-slate-300"} />
        <text x="10" y="10" className="fill-slate-500 text-[11px] font-medium">
          {stats?.patients || 0} Patients • {stats?.infected || 0} Infected
        </text>
      </g>

      {stats?.risk === 'high' && (
        <g transform={`translate(${x + width - 40}, ${y + 20})`}>
           <circle r="12" className="fill-danger/10" />
           <AlertCircle className="w-4 h-4 text-danger -ml-2 -mt-2" />
        </g>
      )}
    </g>
  );
}
