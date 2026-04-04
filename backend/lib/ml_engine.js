// --- Advanced Clinical Deterministic Inference Engine (SENTINEL-X) ---
// This module implements multi-dimensional pattern matching for infectious pathogens.

const PATHOGEN_DB = {
    MDR_GRAM_NEGATIVE: {
        keywords: ['cre', 'cpe', 'carbapenem', 'klebsiella', 'e.coli', 'acinetobacter', 'pseudomonas'],
        resistance_markers: ['meropenem', 'imipenem', 'ertapenem', 'colistin'],
        base_risk: 90,
        tier: "TIER 4 - CONTACT PLUS",
        dx: "MDR Gram-Negative Infection (High Mortality Risk)"
    },
    MDR_GRAM_POSITIVE: {
        keywords: ['mrsa', 'vre', 'staph', 'enterococcus', 'staphylococcus'],
        resistance_markers: ['methicillin', 'vancomycin', 'oxacillin', 'penicillin'],
        base_risk: 75,
        tier: "TIER 2 - CONTACT",
        dx: "Resistant Gram-Positive Pathogen"
    },
    RESPIRATORY_OUTBREAK: {
        keywords: ['covid', 'sars', 'flu', 'influenza', 'tb', 'tuberculosis', 'legionella'],
        resistance_markers: ['rifampicin', 'isoniazid', 'osteltamivir'],
        base_risk: 85,
        tier: "TIER 3 - AIRBORNE",
        dx: "High-Contagion Respiratory Pathogen"
    },
    FUNGAL_CRITICAL: {
        keywords: ['auris', 'candida', 'aspergillus', 'mucormycosis'],
        resistance_markers: ['fluconazole', 'amphotericin', 'caspofungin'],
        base_risk: 95,
        tier: "TIER 4 - ENHANCED",
        dx: "Invasive Fungal Pathogen (Outbreak Potential)"
    }
};

const processLabData = (data) => {
    const org = (data.organismParsed || data.organismDetected || "").toLowerCase();
    const resistance = (data.antibioticResistance || []).map(r => r.toLowerCase());
    const vitals = data.vitals || { temperatureC: 37, heartRate: 80, oxygenSaturation: 98 };

    let selectedMatch = null;
    let confidence = 0.5;

    // 1. Cross-Pattern Inference Logic
    for (const [key, profile] of Object.entries(PATHOGEN_DB)) {
        const hasKeyword = profile.keywords.some(k => org.includes(k));
        const hasResistance = profile.resistance_markers.some(rm => resistance.some(r => r.includes(rm)));
        
        if (hasKeyword || hasResistance) {
            selectedMatch = profile;
            // Higher confidence if both keyword AND resistance marker match
            confidence = (hasKeyword && hasResistance) ? 0.98 : 0.75;
            break; 
        }
    }

    if (!selectedMatch) {
        return { riskScore: 10, tier: "STANDARD", diagnosis: "Baseline Observation", recommendedAction: "Routine screening only", confidence: 0.3 };
    }

    // 2. Clinical Vital Adjustment (Dynamic Risk)
    let finalRisk = selectedMatch.base_risk;
    if (vitals.temperatureC > 39) finalRisk += 5;
    if (vitals.oxygenSaturation < 92) finalRisk += 5;
    if (vitals.heartRate > 120) finalRisk += 5;

    return {
        riskScore: Math.min(finalRisk, 99),
        tier: selectedMatch.tier,
        diagnosis: selectedMatch.dx,
        recommendedAction: getActionForTier(selectedMatch.tier),
        confidence: (confidence * 100).toFixed(1) + "%",
        pattern_id: "CDSS-v2.8-SENTINEL"
    };
};

const getActionForTier = (tier) => {
    if (tier.includes('TIER 4')) return "IMMEDIATE ISOLATION + NOTIFY CDO";
    if (tier.includes('TIER 3')) return "AIRBORNE PRECAUTIONS + NEGATIVE PRESSURE";
    if (tier.includes('TIER 2')) return "CONTACT PRECAUTIONS + GOWNING";
    return "STANDARD MONITORING";
};

module.exports = { processLabData };
