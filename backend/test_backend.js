const axios = require('axios');

async function testClinicalEngine() {
    const testData = {
        patientId: "TEST-786",
        demographics: { name: "Aman Kumar", age: 28, gender: "Male" },
        vitals: { temperatureC: 39.5, heartRate: 110, oxygenSaturation: 88 },
        labReport: { 
            sourceSystem: "Alpha-Lab-Clinical", 
            organismDetected: "MDR Tuberculosis detected in sputum", 
            antibioticResistance: ["Rifampin", "Isoniazid"] 
        },
        hospitalContext: { ward: "ICU-3", bedNo: "B-12", admissionDateTime: new Date().toISOString() }
    };

    console.log("--- ⚡ MediShield System Audit: Starting Test Case ---");
    try {
        const response = await axios.post('http://localhost:5000/api/patients', [testData]);
        console.log("\n--- ✅ TEST COMPLETE: Clinical Intelligence Report ---");
        console.log("Source Engine:", response.data.patients[0].source);
        console.log("Final Diagnosis:", response.data.patients[0].diagnosis);
        console.log("Risk Grade:", response.data.patients[0].tier);
        console.log("Risk Score (Neural):", (response.data.patients[0].riskScore * 100).toFixed(1) + "%");
        console.log("Analysis Timestamp:", response.data.patients[0].lastAnalyzed);
        console.log("----------------------------------------------------\n");
    } catch (err) {
        if (err.response) {
            console.error("\n❌ SERVER CRASH REPORT:");
            console.error("Message:", err.response.data.message);
            console.error("Stack Trace:", err.response.data.stack);
            console.error("------------------------\n");
        } else {
            console.error("No response from server. Check if backend is running.", err.message);
        }
    }
}

testClinicalEngine();
