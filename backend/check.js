const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
    try {
        // Try the 2.5 version, which is the current stable standard
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent("Say 'Connection Successful!'");
        console.log(result.response.text());
    } catch (err) {
        console.error("Connection failed. Try 'gemini-2.0-flash' or check your API key.");
        console.error("Original Error:", err.message);
    }
}

run();