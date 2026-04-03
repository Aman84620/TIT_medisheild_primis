import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import PatientPortal from './pages/PatientPortal';
import Login from './pages/Login';
import TransitionWrapper from './components/TransitionWrapper';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { SettingsProvider } from './context/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: '16px', background: '#0f172a', color: '#fff' } }} />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<TransitionWrapper><LandingPage /></TransitionWrapper>} />
              <Route path="/login" element={<TransitionWrapper><Login /></TransitionWrapper>} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/patient" element={<TransitionWrapper><PatientPortal /></TransitionWrapper>} />
              <Route path="/patient/:id" element={<TransitionWrapper><PatientPortal /></TransitionWrapper>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;
