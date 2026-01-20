const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
  try {
    // There is no direct listModels in the client SDK like this usually, 
    // but we can try a simple request or check the docs.
    // Actually, let's just try gemini-1.5-flash-latest or gemini-pro.
    console.log("Testing gemini-1.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash");
  } catch (err) {
    console.error("Failed with gemini-1.5-flash:", err.message);
    
    try {
        console.log("Testing gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-pro");
    } catch (err2) {
        console.error("Failed with gemini-pro:", err2.message);
    }
  }
}

listModels();
