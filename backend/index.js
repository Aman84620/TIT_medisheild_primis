const express = require('express');
const cors = require('cors');
const axios = require('axios'); // For custom ML and Tracing APIs
require('dotenv').config();
const aiService = require('./services/aiService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// --- FIREBASE CONFIG & FALLBACK ---
const useFirebase = process.env.FIREBASE_PROJECT_ID && 
                    process.env.FIREBASE_CLIENT_EMAIL && 
                    process.env.FIREBASE_PRIVATE_KEY;

let patientsRef, alertsRef, reportsRef;
let mockPatients = [
  { id: '1', name: 'John Doe', status: 'Infected', pathogen: 'MRSA', riskScore: 85 },
  { id: '2', name: 'Jane Smith', status: 'Exposed', pathogen: 'None', riskScore: 45 },
];
let mockAlerts = [
  { id: '101', type: 'High Risk', message: 'MRSA detected in Ward A', time: '10:30 AM' },
];
let mockReports = [];

if (useFirebase) {
    try {
      const { db } = require('./config/firebase');
      patientsRef = db.collection('patients');
      alertsRef = db.collection('alerts');
      reportsRef = db.collection('reports');
      console.log("🔥 Connected to Firebase Firestore");
    } catch (err) {
      console.error("Firebase init failed, falling back to MOCK MODE");
    }
} else {
    console.warn("⚠️ Running in MOCK MODE (In-memory storage).");
}

// --- AUTH ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@medishield.ai' && password === 'demo123') {
    return res.json({ success: true, user: { id: 'admin-1', name: 'Admin User', role: 'admin' }, token: 'mock-jwt-token' });
  }
  if (email && password) {
    res.json({ success: true, user: { id: 'user-1', name: 'Hospital Staff', role: 'staff' }, token: 'mock-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// --- DASHBOARD STATS ---
app.get('/api/dashboard/stats', async (req, res) => {
  if (useFirebase) {
    try {
      const pSnap = await patientsRef.count().get();
      const aSnap = await alertsRef.count().get();
      return res.json({ avgDetectionTime: '2.3h', accuracy: '95%', activeAlerts: aSnap.data().count, totalPatients: pSnap.data().count });
    } catch (e) {}
  }
  res.json({ avgDetectionTime: '2.3h', accuracy: '95%', activeAlerts: mockAlerts.length, totalPatients: mockPatients.length });
});

// --- PATIENTS ---
app.get('/api/patients', async (req, res) => {
  if (useFirebase) {
    try {
      const snap = await patientsRef.get();
      return res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {}
  }
  res.json(mockPatients);
});

// --- AI ANALYSIS ---
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const analysis = await aiService.analyzePathogen(req.body);
    res.json(analysis);
  } catch (e) {
    res.status(500).json({ error: "AI failed" });
  }
});

// --- CUSTOM ML MODEL (NEW) ---
app.post('/api/ml/analyze', async (req, res) => {
  if (!process.env.CUSTOM_ML_URL) return res.status(403).json({ error: "ML URL Missing" });
  try {
    const response = await axios.post(process.env.CUSTOM_ML_URL, req.body, {
      headers: { 'Authorization': `Bearer ${process.env.CUSTOM_ML_API_KEY}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Custom ML failed:", error.message);
    res.status(500).json({ error: "Custom ML Call Failed" });
  }
});

// --- REAL-TIME TRACING (RADAR.IO) ---
const contactService = require('./services/contactService');

app.post('/api/tracing/analyze', async (req, res) => {
  try {
     const { patients } = req.body;
     if (!patients || !Array.isArray(patients)) return res.status(400).json({ error: "Patients list required" });
     
     const contacts = await contactService.detectContacts(patients);
     res.json({
        success: true,
        count: contacts.length,
        contacts,
        engine: process.env.RADAR_API_KEY ? "Radar.io + Matrix" : "Math-Fallback-Active"
     });
  } catch (error) {
     res.status(500).json({ error: "Contact Tracing Analysis Failed" });
  }
});

app.post('/api/tracing/track', async (req, res) => {
  const { lat, lng, userId } = req.body;
  if (!lat || !lng) return res.status(400).json({ error: "Coordinates missing" });
  
  try {
    const response = await axios.get(`https://api.radar.io/v1/context?coordinates=${lat},${lng}`, {
      headers: { 'Authorization': process.env.RADAR_API_KEY || 'no-key' }
    });
    res.json({ userId, context: response.data, status: "Location Synced" });
  } catch (error) {
    res.json({ userId, status: "Local Tracking Active", location: { lat, lng } });
  }
});

// --- PATIENT CREATION (BULK & SINGLE) ---
app.post('/api/patients', async (req, res) => {
  try {
    const patientData = Array.isArray(req.body) ? req.body : [req.body];


    console.log(`--- ⚡ MediShield LIGHTNING CORE: Parallelizing ${patientData.length} records ---`);

    const results = await Promise.all(patientData.map(async (data, idx) => {
      // 1. Perform Real-time Hybrid AI Analysis (Parallel + Load Balanced)
      const analysis = await aiService.analyzePathogen(data, idx);
      
      const id = data.id || `P-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newPatient = {
        ...data,
        id,
        diagnosis: analysis.dx || analysis.result?.dx || analysis.infection_ai?.disease || "Monitoring Case",
        tier: analysis.tier || analysis.result?.tier || analysis.control_ai?.isolation_tier || "Tier 1",
        riskScore: analysis.riskScore || analysis.result?.riskScore || analysis.risk_ai?.spread_score || 0.15,
        source: analysis.source || "MediShield-Bayesian-Core",
        lastAnalyzed: new Date().toISOString()
      };

      // 2. Persist Analyzed Record (NON-BLOCKING)
      if (useFirebase) {
        patientsRef.doc(id).set(newPatient).catch(err => console.error("Firebase Sync Error:", err.message));
      } else {
        const idx = mockPatients.findIndex(p => p.id === id);
        if (idx !== -1) mockPatients[idx] = newPatient;
        else mockPatients.push(newPatient);
      }
      return newPatient;
    }));

    res.status(201).json({
      success: true,
      count: results.length,
      patients: results
    });
  } catch (error) {
    console.error("Critical Analysis Engine Error:", error.message);
    res.status(500).json({ 
        error: "High-level diagnostic system failure", 
        detail: error.message 
    });
  }
});


// --- CONFIG STATUS ---
app.get('/api/config/status', (req, res) => {
  res.json({
    firebase: useFirebase ? "active" : "missing",
    gemini: process.env.GEMINI_API_KEY ? "active" : "missing",
    customML: process.env.CUSTOM_ML_URL ? "active" : "missing",
    tracing: process.env.RADAR_API_KEY ? "active" : "missing",
  });
});

const path = require('path');

// --- PRODUCTION CSP & SECURITY FIX ---
// Relaxing CSP for the prototype so that browser doesn't block scripts/blobs on Render
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src * 'unsafe-inline'; img-src * data: blob:; frame-src *; style-src * 'unsafe-inline';"
  );
  next();
});

// --- SERVE FRONTEND STATIC ASSETS ---
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// --- API ROUTES (Pehle se defined hain) ---

// --- ROOT ROUTE (Status Check) ---
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: "MediShield AI Core: Online",
    version: "4.8.5.Hyper",
    deployment: "Full-Stack-Ready"
  });
});

// --- WILDCARD ROUTE (Fixes 404 on refresh) ---
// Isse har unknown route frontend ki index.html pe jayega
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).send('API Route Not Found');
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).json({
        message: "Backend is Active. To see Frontend, run 'npm run build' in frontend folder.",
        api_status: "Operational"
      });
    }
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Production Server ACTIVE on PORT ${PORT}`);
});

// Handle server errors (e.g. Port already in use)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} is already in use.`);
    console.log('Try running: taskkill /F /IM node.exe');
  } else {
    console.error('❌ Server Error:', err.message);
  }
  process.exit(1);
});

