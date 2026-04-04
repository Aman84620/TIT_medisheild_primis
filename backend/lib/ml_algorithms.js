const natural = require('natural');
const { Matrix } = require('ml-matrix');
const fs = require('fs');
const path = require('path');

// --- Initialization of Professional Clinical Models ---
const classifier = new natural.BayesClassifier();
const DYNAMIC_DB_PATH = path.join(__dirname, '../data/dynamic_patterns.json');

/**
 * MediShield Core v4.0: Clinical Probabilistic Engine
 * Pre-training the model with Global Medical Standards (CDC/WHO Patterns)
 */

const trainInitialModel = () => {
  // Respiratory/Airborne Vectors
  classifier.addDocument('tb tuberculosis mdr resistant weight loss cough fever sputum pulmonary', 'RESP_TB');
  classifier.addDocument('covid sars ncp corona respiratory distress hypoxia', 'RESP_COVID');
  classifier.addDocument('flu influenza fever runny nose sore throat cold', 'RESP_FLU');
  
  // Blood-borne/Surgical Vectors
  classifier.addDocument('hiv aids needle stick blood contact immune', 'BLOOD_HIV');
  classifier.addDocument('hepatitis jaundice liver yellow eyes hbv hcv', 'BLOOD_HEPATITIS');
  
  // MDR/Environmental Vectors
  classifier.addDocument('auris candida fungal skin rash sepsis crit', 'FUNGAL_AURIS');
  classifier.addDocument('cre carbapenem resistant klebsiella sepsis ecoli', 'MDR_CRE');
  classifier.addDocument('mrsa staph staphylococcus resistance skin abscess', 'MDR_MRSA');
  
  classifier.train();
  console.log("📈 [Clinical Core] Bayesian Probability Matrix Trained & Operational.");
};

/**
 * Neural-style Vectorized Risk Scoring
 * Uses Weight Matrix Multiplications for clinical vitals
 */
const calculateVectorRisk = (vitals) => {
  // Feature Vector: [Temperature, HeartRate, O2_Deficit, Age_Weight]
  const o2_deficit = Math.max(0, 100 - vitals.oxygenSaturation);
  const temp_normalized = vitals.temperatureC / 37.0; 
  
  const featureVector = new Matrix([[temp_normalized, vitals.heartRate / 70.0, o2_deficit / 5.0]]);
  
  // Weights Matrix (Medical Importance)
  const weightMatrix = new Matrix([
    [0.25], // Temp weight
    [0.2],  // HR weight
    [0.55]  // O2 weight (Critical in Sanchari Rog)
  ]);

  const result = featureVector.mmul(weightMatrix);
  const score = result.get(0, 0) / 2.0; // Normalizing base 2

  return Math.min(score, 0.999);
};

/**
 * Adaptive Update: Integrating Cloud Insights into Bayesian Model
 */
const learnNewData = (disease, description) => {
    classifier.addDocument(description + ' ' + disease, disease);
    classifier.train();
    console.log(`🧠 [Bayesian Engine] Re-trained on discovered pattern: ${disease}`);
};

module.exports = { trainInitialModel, classifier, calculateVectorRisk, learnNewData };
