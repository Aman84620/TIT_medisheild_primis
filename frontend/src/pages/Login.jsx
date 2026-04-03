import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'admin') navigate('/admin');
    else navigate('/patient');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-400"></div>
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/20">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Access MediShield</h1>
          <p className="text-slate-400 text-sm mt-2">Enter your secure identification credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-100 rounded-2xl mb-8">
             <button 
               type="button"
               onClick={() => setRole('admin')}
               className={`py-2.5 rounded-xl text-sm font-bold transition-all ${role === 'admin' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Administrator
             </button>
             <button 
               type="button"
               onClick={() => setRole('patient')}
               className={`py-2.5 rounded-xl text-sm font-bold transition-all ${role === 'patient' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Patient User
             </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
               <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
               <input 
                 type="text" 
                 placeholder="Terminal ID or User ID" 
                 className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
               />
            </div>
            <div className="relative">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
               <input 
                 type="password" 
                 placeholder="Security Key" 
                 className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
               />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            Authenticate <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-xs font-medium">
          Protected by AES-256 Quantum Shield Encryption
        </p>
      </div>
    </div>
  );
}
