import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPatients } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { RefreshCw, Search, ShieldAlert, ShieldCheck, AlertTriangle, Download, Filter, Activity } from 'lucide-react';

export default function PatientTracker() {
  const [patients, setPatients] = useState([]);
  const { maskName } = useSettings();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');

  const exportToCSV = () => {
    const headers = ['Name', 'Age', 'Gender', 'Zone', 'Status'];
    const rows = filteredPatients.map(p => [p.name, p.age, p.gender, p.currentZone, p.infectionStatus]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MediShield_Patients_${new Date().toISOString().slice(0,10)}.csv`);
    link.click();
  };

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      console.error("Failed to load patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.infectionStatus === statusFilter;
    const matchesZone = zoneFilter === 'All' || p.currentZone === zoneFilter;
    return matchesSearch && matchesStatus && matchesZone;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h3 className="font-semibold text-slate-800 text-lg">Patient Tracker</h3>
          <p className="text-sm text-slate-500">Live roster of monitored patients</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <select 
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-primary/20 outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Infected">Infected</option>
              <option value="Medium Risk">Medium Risk</option>
              <option value="Safe">Safe</option>
            </select>
            <select 
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-primary/20 outline-none"
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
            >
              <option value="All">All Zones</option>
              <option value="ICU-A">ICU-A</option>
              <option value="Ward-3">Ward-3</option>
              <option value="ER">ER</option>
              <option value="Cafeteria">Cafeteria</option>
            </select>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors font-bold shadow-md shadow-primary/20"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={loadPatients}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-white text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium border border-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="py-4 px-6 font-medium text-slate-500 text-sm">Patient Name</th>
              <th className="py-4 px-6 font-medium text-slate-500 text-sm">Age / Gender</th>
              <th className="py-4 px-6 font-medium text-slate-500 text-sm">Current Zone</th>
              <th className="py-4 px-6 font-medium text-slate-500 text-sm">Status</th>
              <th className="py-4 px-6 font-medium text-slate-500 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">Loading patient data...</td>
              </tr>
            ) : filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">No patients found.</td>
              </tr>
            ) : (
              filteredPatients.map(patient => (
                <tr key={patient._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{maskName(patient.name)}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{patient._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{patient.age} / {patient.gender}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-sm font-medium border border-slate-200">
                      {patient.currentZone}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={patient.infectionStatus} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link to={`/admin/trace/${patient._id}`} className="text-primary text-sm font-medium hover:underline">
                       Infection Trace
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'Infected') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/10 text-danger text-sm font-medium border border-danger/20">
        <ShieldAlert className="w-4 h-4" /> Infected
      </div>
    );
  }
  if (status === 'Medium Risk') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium border border-warning/20">
        <AlertTriangle className="w-4 h-4" /> Medium Risk
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-safe/10 text-safe text-sm font-medium border border-safe/20">
      <ShieldCheck className="w-4 h-4" /> Safe
    </div>
  );
}
