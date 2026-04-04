const localModel = require('./lib/local_model');

const testData = {
    patientId: "TEST-786",
    demographics: { name: "Aman Kumar", age: 28, gender: "Male" },
    vitals: { temperatureC: 39.5, heartRate: 110, oxygenSaturation: 88 },
    labReport: { 
        organismDetected: "MDR Tuberculosis detected in sputum", 
        antibioticResistance: ["Rifampin", "Isoniazid"] 
    },
    symptoms: ["Cough", "Weight loss"]
};

console.log("--- 🧠 STANDALONE ENGINE TEST: MediShield Bayesian Core ---");
try {
    const analysis = localModel.runInference(testData);
    console.log("\n✅ ANALYSIS SUCCESSFUL!");
    console.log("Is Match:", analysis.isLocalMatch);
    console.log("Confidence:", analysis.confidence);
    console.log("Diagnosis:", analysis.result.dx);
    console.log("Isolation Tier:", analysis.result.tier);
    console.log("Risk Score:", (analysis.result.riskScore * 100).toFixed(2) + "%");
    console.log("Transmission Mode:", analysis.result.transmission);
    console.log("Clinical Reco:", analysis.result.reco);
    console.log("----------------------------------------------------\n");
} catch (err) {
    console.error("❌ ENGINE CRASH DETECTED!");
    console.error(err);
}
