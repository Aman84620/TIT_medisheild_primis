import React, { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getGraphData, seedDatabase } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { RefreshCw, Play } from 'lucide-react';

export default function ContactTracing() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const fgRef = useRef();
  const { maskName } = useSettings();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getGraphData();
      setGraphData(data);
    } catch (err) {
      console.error("Failed to load graph:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeed = async () => {
    await seedDatabase();
    await loadData();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col overflow-hidden relative">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 relative z-10">
        <div>
          <h3 className="font-semibold text-slate-800">Infection Contact Graph</h3>
          <p className="text-xs text-slate-500">Real-time mapping of interactions and transmission risks.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSeed}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors font-medium"
          >
            <Play className="w-4 h-4" /> Generate Mock Data
          </button>
          <button 
            onClick={loadData}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg transition-colors font-medium border border-slate-300"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-slate-900 relative">
        {loading ? (
           <div className="absolute inset-0 flex items-center justify-center text-white">Loading data...</div>
        ) : graphData.nodes.length === 0 ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
               <p>No contact tracing data available.</p>
               <button onClick={handleSeed} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">Seed Mock Data</button>
           </div>
        ) : (
          <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            nodeLabel={(node) => `${maskName(node.id)} (${node.zone})`}
            nodeColor={node => 
              node.status === 'Infected' ? '#ef4444' : 
              node.status === 'Medium Risk' ? '#f59e0b' : '#10b981'
            }
            nodeRelSize={6}
            linkColor={() => 'rgba(255,255,255,0.2)'}
            linkWidth={link => link.riskLevel / 10 + 1}
            cooldownTicks={100}
            onEngineStop={() => fgRef.current.zoomToFit(400, 50)}
          />
        )}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-lg z-10 text-xs text-slate-700">
         <h4 className="font-semibold mb-2 text-slate-800">Legend</h4>
         <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-danger"></div> Infected</div>
         <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-warning"></div> Medium Risk</div>
         <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-safe"></div> Safe</div>
         <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200"><div className="w-4 h-0.5 bg-slate-400"></div> Interaction Line (width = risk)</div>
      </div>
    </div>
  );
}
