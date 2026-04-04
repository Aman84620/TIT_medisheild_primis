const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testAll() {
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent("ping");
      console.log(`✅ ${m} SUCCESS:`, (await res.response).text());
      return; 
    } catch (e) {
      console.error(`❌ ${m} FAILED:`, e.message);
    }
  }
}

testAll();
