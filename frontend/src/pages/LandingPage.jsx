import { Link } from 'react-router-dom';
import { Activity, Shield, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-safe/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/30">
            <Shield className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">MediShield AI</h1>
        </div>
        <nav className="flex gap-6 items-center">
          <Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Patient Access</Link>
          <Link to="/login" className="px-6 py-2 rounded-full font-medium transition-all bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20">
            Admin Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center z-10 z-10 mt-[-100px]">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 font-medium text-sm border border-blue-500/20 mb-8 mt-16 animate-fade-in-up">
          <Activity className="w-4 h-4" /> Next-Gen Hospital Intelligence
        </div>
        
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight px-4">
          Predict. Prevent. Protect.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Before It Spreads.</span>
        </h2>
        
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed px-6">
          The ultimate platform for hospitals to track infectious diseases, reconstruct patient interactions, and identify outbreaks before they escalate.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mt-4 w-full sm:w-auto px-10 sm:px-0">
          <Link to="/login" className="px-10 py-5 rounded-2xl bg-primary text-white font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/40 flex items-center justify-center gap-3">
            Admin Dashboard <Activity className="w-6 h-6"/>
          </Link>
          <Link to="/login" className="px-10 py-5 rounded-2xl bg-white text-slate-900 font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10 flex items-center justify-center gap-3">
            Patient Portal <Users className="w-6 h-6"/>
          </Link>
        </div>
      </main>
    </div>
  );
}
