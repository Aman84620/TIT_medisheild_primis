const { classifySymptom, predictWardRisk } = require('./lib/ml_engine');
const fs = require('fs');
const path = require('path');

// 🧪 SIMULATED MEDISHIELD AI TESTING ENVIRONMENT
const testSuite = [
  { name: 'Patient 1 (Severe)', symptoms: 'Fever, cough, chest pain, breathlessness' },
  { name: 'Patient 2 (Moderate)', symptoms: 'Mild fever, sore throat' },
  { name: 'Patient 3 (Stable)', symptoms: 'None' }
];

const runTest = async () => {
    console.log("🚀 MediShield AI Live Model Testing Initialized...");
    console.log("-----------------------------------------------");
    
    let reportContent = "# 🚀 MediShield AI - ML Testing Report\n\n";
    reportContent += "| Patient Name | Symptoms | Prediction Result | Confidence | Latency |\n";
    reportContent += "| :--- | :--- | :--- | :--- | :--- |\n";

    testSuite.forEach(patient => {
        const result = classifySymptom(patient.symptoms);
        console.log(`✅ [${patient.name}] -> Prediction: ${result.diagnosis} | Latency: ${result.latency}`);
        
        reportContent += `| ${patient.name} | ${patient.symptoms} | ${result.diagnosis} | ${(result.confidence * 100).toFixed(0)}% | ${result.latency} |\n`;
    });

    console.log("\n🧪 Running Ward Heatmap Forecasting...");
    const ward1 = predictWardRisk(8, 90);
    console.log(`✅ Ward A-1 Risk: ${ward1.wardRisk}% | Status: ${ward1.status}`);
    reportContent += `\n\n## 🗺️ Ward Heatmap Forecasting Result\n- **Ward A-1**: ${ward1.wardRisk}% Risk | Status: ${ward1.status}\n`;

    const reportPath = path.join(__dirname, '..', 'ml_testing_report.md');
    fs.writeFileSync(reportPath, reportContent);
    console.log(`\n📄 Report Generated: ml_testing_report.md`);
};

runTest();
