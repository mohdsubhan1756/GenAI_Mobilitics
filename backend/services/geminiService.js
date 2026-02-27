// const axios = require('axios');

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// async function analyzePrescription(base64Image) {
//     const response = await axios.post(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
//         {
//             contents: [
//                 {
//                     parts: [
//                         {
//                             text: `
// Extract and structure the following from this medical prescription:
// - Diagnosis
// - Body part affected
// - Severity (mild / moderate / severe)
// - Medicines (if any)
// Respond ONLY in valid JSON.
// `
//                         },
//                         {
//                             inlineData: {
//                                 mimeType: "image/jpeg",
//                                 data: base64Image
//                             }
//                         }
//                     ]
//                 }
//             ]
//         }
//     );

//     return response.data.candidates[0].content.parts[0].text;
// }

// module.exports = { analyzePrescription };






//
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function analyzeCondition(text) {
//   // Use a model that exists in your SDK
//   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-turbo' });

//   const prompt = `
// You are a medical rehabilitation assistant.

// Input:
// "${text}"

// Return JSON ONLY:
// {
//   "diagnosis": "",
//   "severity": "mild | moderate | severe",
//   "dietPlan": ["..."],
//   "exercisePlan": [
//     { "week": 1, "intensity": "low", "exercises": ["..."] },
//     { "week": 2, "intensity": "medium", "exercises": ["..."] },
//     { "week": 3, "intensity": "high", "exercises": ["..."] }
//   ]
// }
// `;

//   const result = await model.generateContent(prompt);

//   // Your SDK returns text here
//   return JSON.parse(result.response.text());
// }

// module.exports = { analyzeCondition };





//
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeCondition(inputText, base64Image = null) {
  // CHANGED: Use gemini-2.0-flash (matches your successful check.js test)
  // const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  // const prompt = `
  //   You are a medical rehabilitation assistant. 
  //   Analyze the provided input (text or image of a prescription).

  //   Return JSON ONLY:
  //   {
  //     "diagnosis": "string",
  //     "bodyPart": "string",
  //     "severity": "mild | moderate | severe",
  //     "dietPlan": ["string"],
  //     "exercisePlan": [
  //       { "week": 1, "intensity": "low", "exercises": ["string"] }
  //     ],
  //     "medicines": ["string"]
  //   }
  // `;

  const prompt = `
You are a medical rehabilitation assistant. 
Analyze the patient's condition from the provided input (text or prescription image).

Return JSON ONLY with these fields:
{
  "diagnosis": "string",
  "bodyPart": "string",
  "severity": "mild | moderate | severe",
  "dietPlan": ["string"],        // Suggested diet based on condition
  "exercisePlan": [              // Weekly progressive exercises
    { "week": 1, "intensity": "low", "exercises": ["string"] },
    { "week": 2, "intensity": "medium", "exercises": ["string"] },
    { "week": 3, "intensity": "high", "exercises": ["string"] }
  ],
  "medicines": ["string"]
}
Focus on patient's condition and suggest diet & exercises accordingly.
`;



  let payload = [prompt];

  if (base64Image) {
    payload.push({
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg"
      }
    });
  } else if (inputText) {
    payload.push(inputText);
  }

  try {
    const result = await model.generateContent(payload);
    const response = await result.response;
    let text = response.text();

    // Clean potential markdown formatting from the response
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Error:", error.message);
    throw error;
  }
}

module.exports = { analyzeCondition };