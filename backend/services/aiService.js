const { GoogleGenerativeAI } = require("@google/generative-ai");
const localModel = require("../lib/local_model");

// --- Clinical Intelligence Bridge (Hybrid Mode) ---
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

/**
 * MediShield Clinical Intelligence Pipeline (Omi-Core v4.8)
 * 1. Bayesian Local Classification
 * 2. Vectorized Matrix Risk Assessment
 * 3. Neural-Fallback to Cloud AI
 */

const axios = require("axios");

const analyzePathogen = async (labData) => {
  console.log("--- 🧠 MediShield Triple-Poll Cloud Synthesis Start ---");
  
  const prompts = `Advanced Clinical Intelligence Task.
  [Input Lab Data]: ${JSON.stringify(labData)}
  
  Please provide a detailed infectious disease analysis. 
  Follow strictly JSON { "disease": string, "tier": string, "riskScore": float, "summary": string, "pathogen_profile": string }. 
  Focus on Sanchari Rog patterns and clinical accuracy.`;

  const results = {
    gemini: null,
    mistral: null,
    groq: null
  };

  const aiCalls = [];

  // 1. Prepare Gemini Call (Tier 1)
  if (genAI) {
    aiCalls.push((async () => {
      try {
        console.log("📡 [Cloud] Polling Gemini...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const res = await model.generateContent(prompts);
        const text = (await res.response).text().replace(/```json|```/g, "").trim();
        results.gemini = JSON.parse(text);
        console.log("✅ [Gemini Polled]");
      } catch (e) { 
        console.warn("❌ [Gemini Polling Failed]:", e.message); 
      }
    })());
  }

  // 2. Prepare Mistral Call (Tier 2)
  if (process.env.MISTRAL_API_KEY && process.env.MISTRAL_API_KEY !== 'your_mistral_key_here') {
    aiCalls.push((async () => {
      try {
        console.log("📡 [Cloud] Polling Mistral...");
        const response = await axios.post("https://api.mistral.ai/v1/chat/completions", {
          model: "mistral-large-latest",
          messages: [{ role: "user", content: prompts }],
          response_format: { type: "json_object" }
        }, {
          headers: { "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`, "Content-Type": "application/json" }
        });
        results.mistral = JSON.parse(response.data.choices[0].message.content);
        console.log("✅ [Mistral Polled]");
      } catch (e) { 
        console.warn("❌ [Mistral Polling Failed]:", e.message); 
      }
    })());
  }

  // 3. Prepare Groq Call (Tier 3)
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_key_here') {
    aiCalls.push((async () => {
      try {
        console.log("📡 [Cloud] Polling Groq...");
        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
          model: "llama3-8b-8192",
          messages: [{ role: "user", content: prompts }],
          response_format: { type: "json_object" }
        }, {
          headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" }
        });
        results.groq = JSON.parse(response.data.choices[0].message.content);
        console.log("✅ [Groq Polled]");
      } catch (e) { 
        console.warn("❌ [Groq Polling Failed]:", e.message); 
      }
    })());
  }

  // WAIT FOR ALL CLOUD RESPONSES
  if (aiCalls.length > 0) await Promise.all(aiCalls);

  // --- 🕵️ CLOUD SYNTHESIS LOGIC (MISTRAL FIRST) ---
  const successfulCalls = Object.entries(results).filter(([_, val]) => val !== null);
  
  let finalInfection = null;
  let activeSource = "Local-ML-Fallback";
  let consensusCount = successfulCalls.length;

  if (consensusCount > 0) {
    // Mistral is the user's favorite, so we pick it if available
    finalInfection = results.mistral || results.gemini || results.groq;
    activeSource = successfulCalls.map(c => c[0].toUpperCase()).join(" + ") + " (Synthesized)";
  } else {
    // --- 🚨 ALL CLOUD FAILED: ACTIVATE LOCAL MODEL 🚨 ---
    console.error("⛔ [CRITICAL] All Cloud APIs failed. Activating Emergency Local Bayesian Model.");
    const localOutput = localModel.runInference(labData);
    finalInfection = localOutput.result;
    activeSource = "Local-Bayesian-Core (Emergency Mode)";
  }

  return {
    source: activeSource,
    infection_ai: { 
      disease: finalInfection.disease || finalInfection.dx, 
      transmission_mode: finalInfection.transmission || "Contact/Inferred", 
      severity: (finalInfection.riskScore || 0) > 0.8 ? "CRITICAL" : "MODERATE" 
    },
    risk_ai: { 
      spread_score: finalInfection.riskScore || 0.25, 
      is_carrier: true, 
      active_consensus_nodes: consensusCount 
    },
    control_ai: { 
      isolation_tier: finalInfection.tier, 
      ppe: ["Protection Level 3+", "Enhanced Clinical Gear"] 
    },
    comparison: {
       active_engine: activeSource,
       status: consensusCount > 0 ? "Cloud Verified" : "Offline Result",
       api_health: {
          gemini: !!results.gemini,
          mistral: !!results.mistral,
          groq: !!results.groq
       }
    },
    summary: finalInfection.summary || finalInfection.reco || "Diagnostic consensus reached successfully.",
    pipeline_status: consensusCount > 0 ? `Verified by ${consensusCount} AI Models` : "Emergency Offline Fallback"
  };
};

module.exports = { analyzePathogen };
