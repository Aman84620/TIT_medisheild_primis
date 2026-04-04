const { classifier, calculateVectorRisk, trainInitialModel, learnNewData } = require('./ml_algorithms');
const fs = require('fs');
const path = require('path');

// --- Real ML Model Init ---
trainInitialModel();
const DYNAMIC_DB_PATH = path.join(__dirname, '../data/dynamic_patterns.json');

/**
 * MediShield Real Local Discovery Engine
 * This engine takes raw lab data and performs Bayesian Classification + Vector Math
 */

const runInference = (data) => {
  try {
    // 🔥 DATA MAPPING GUARD (Handles both nested and flat schemas)
    const lab = data.labReport || data;
    const organism = lab.organismDetected || lab.organism || "Unknown Pathogen";
    const resistance = lab.antibioticResistance || [];
    const symptoms = data.symptoms || data.pastInfections || [];
    
    const rawText = `${organism} ${resistance.join(' ')} ${symptoms.join(' ')}`.toLowerCase();
    
    console.log(`[OmniCore] Classifying Text: ${organism}...`);
    
    // 1. Bayesian Probability Match (Professional NLP)
    const classification = classifier.classify(rawText);
    const confidenceData = classifier.getClassifications(rawText);
    
    // Calculate relative confidence (Math-based with safety guard)
    const topMatch = confidenceData && confidenceData.length > 0 ? confidenceData[0] : { value: 0 };
    const topMatchValue = topMatch.value;
    const confidenceText = (topMatchValue * 100).toFixed(1) + "% (Bayesian)";

    // 2. Vectorized Clinical Risk (Medical Math)
    const vitals = data.vitals || { temperatureC: 37, heartRate: 80, oxygenSaturation: 98 };
    const matrixRisk = calculateVectorRisk(vitals);
    
    const finalResult = mapClassificationToInfection(classification, matrixRisk);

    return {
        isLocalMatch: topMatchValue > 0.45,
        confidence: confidenceText,
        result: finalResult
    };

  } catch (err) {
      console.error("Critical Engine Runtime Error:", err);
      // Fail-gracefully (No 500 crashes)
      return {
          isLocalMatch: false,
          confidence: "Low (Rescue Mode)",
          result: { dx: "Complex Pattern", tier: "Tier 2", riskScore: 0.5, reco: "Manual clinical review required." }
      };
  }
};

const mapClassificationToInfection = (tag, risk) => {
  const map = {
    'RESP_TB': { dx: 'Tuberculosis (Sanchari Rog Detected)', tier: 'Tier 3 - Airborne', reco: 'Initiate 4-Drug Regimen & Respiratory Iso' },
    'RESP_COVID': { dx: 'COVID/SARS Infectious Distress', tier: 'Tier 3 - Droplet/Airborne', reco: 'Negative Pressure / N95 REQUIRED' },
    'RESP_FLU': { dx: 'Seasonal Infectious Influenza', tier: 'Tier 2 - Droplet', reco: 'Surgical Masking & Supportive Care' },
    'BLOOD_HIV': { dx: 'Blood-borne Transmission (Immune)', tier: 'Tier 2 - Standard/Universal', reco: 'Universal Precautions & ART Review' },
    'BLOOD_HEPATITIS': { dx: 'Infectious Hepatitis (Jaundice)', tier: 'Tier 2 - Enteric/Blood', reco: 'Enteric/Contact/Blood Precautions' },
    'FUNGAL_AURIS': { dx: 'MDR Candida Auris (Critical Outbreak)', tier: 'Tier 4 - Enhanced Isolation', reco: 'Standard Disinfectants FAIL - use Chlorine base' },
    'MDR_CRE': { dx: 'MDR Gram-Negative CRE Outbreak', tier: 'Tier 4 - Contact Plus', reco: 'Strict Contact Control & Isolation' }
  };

  const info = map[tag] || { dx: 'Non-Specific Infection Pattern', tier: 'Standard', reco: 'Routine monitoring' };
  
  return {
    ...info,
    riskScore: risk,
    transmission: info.tier.includes('Airborne') ? 'High-Contagion (Air)' : 'Moderate (Contact/Blood)'
  };
};

/**
 * Learning Loop: Feeds Cloud AI insights back into the Bayesian Engine
 */
const trainLocalModel = (disease, description) => {
    try {
        learnNewData(disease, description);
    } catch (e) {
        console.error("Training Refinement Error:", e);
    }
};

module.exports = { runInference, trainLocalModel };
