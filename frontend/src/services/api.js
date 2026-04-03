import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const seedDatabase = async () => {
  const response = await axios.post(`${API_URL}/seed`);
  return response.data;
};

export const getPatients = async () => {
  const response = await axios.get(`${API_URL}/patients`);
  return response.data;
};

export const getGraphData = async () => {
  const response = await axios.get(`${API_URL}/graph`);
  return response.data;
};

export const getAlerts = async () => {
  const response = await axios.get(`${API_URL}/alerts`);
  return response.data;
};

export const getAnalyticsSpread = async () => {
  const response = await axios.get(`${API_URL}/analytics/spread`);
  return response.data;
};

export const runPrediction = async () => {
  const response = await axios.post(`${API_URL}/predict`);
  return response.data;
};

export const getZoneData = async () => {
  const response = await axios.get(`${API_URL}/zones`);
  return response.data;
};

export const simulateInteraction = async () => {
  const response = await axios.post(`${API_URL}/simulate`);
  return response.data;
};

export const getInfectionTrace = async (id) => {
  const response = await axios.get(`${API_URL}/trace/${id}`);
  return response.data;
};

export const getAIModelCard = async () => {
  const response = await axios.get(`${API_URL}/ai/model-card`);
  return response.data;
};

export const inferRisk = async (interactions) => {
  const response = await axios.post(`${API_URL}/ai/infer`, { interactions });
  return response.data;
};
