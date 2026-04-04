// Deployment-ready API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchStats = async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
};

export const fetchPatients = async () => {
    const response = await fetch(`${API_BASE_URL}/patients`);
    if (!response.ok) throw new Error('Failed to fetch patients');
    return response.json();
};

export const loginUser = async (credentials: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error('Authentication failed');
    return response.json();
};

export const fetchReports = async () => {
    const response = await fetch(`${API_BASE_URL}/reports`);
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
};

export const createReport = async (reportData: any) => {
    const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
    });
    if (!response.ok) throw new Error('Failed to create report');
    return response.json();
};

export const analyzePathogen = async (labData: any) => {
    const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(labData)
    });
    if (!response.ok) throw new Error('AI Analysis failed');
    return response.json();
};

export const fetchConfigStatus = async () => {
    const response = await fetch(`${API_BASE_URL}/config/status`);
    if (!response.ok) throw new Error('Failed to fetch config status');
    return response.json();
};

export const addPatients = async (patients: any[]) => {
    const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patients)
    });
    if (!response.ok) throw new Error('Failed to add patients');
    return response.json();
};
