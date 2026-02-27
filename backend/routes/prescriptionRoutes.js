const express = require('express');
const multer = require('multer');
const Prescription = require('../models/Prescription');
const { analyzeCondition } = require('../services/geminiService');

const router = express.Router();
const upload = multer();

const { authMiddleware } = require('./authRoutes')

// router.post('/upload', upload.single('image'), async (req, res) => {
//     console.log("Prescription Check");
//     try {
//         const base64Image = req.file.buffer.toString('base64');

//         const geminiResponse = await analyzeCondition(base64Image);
//         const parsed = JSON.parse(geminiResponse);

//         const prescription = new Prescription({
//             userId: "demo-user",
//             diagnosis: parsed.diagnosis,
//             bodyPart: parsed.body_part,
//             severity: parsed.severity,
//             medicines: parsed.medicines || [],
//             rawText: geminiResponse
//         });

//         await prescription.save();

//         res.json(prescription);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Prescription analysis failed" });
//     }
// });


// router.post('/upload', upload.single('image'), async (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ error: "No image uploaded" });

//         const base64Image = req.file.buffer.toString('base64');

//         // Pass null for text, and the base64 for the image
//         const parsed = await analyzeCondition(null, base64Image);

//         const prescription = new Prescription({
//             userId: "demo-user",
//             diagnosis: parsed.diagnosis,
//             bodyPart: parsed.bodyPart, // matched key name to service
//             severity: parsed.severity,
//             medicines: parsed.medicines || [],
//             rawText: JSON.stringify(parsed)
//         });

//         await prescription.save();
//         res.json(prescription);
//     } catch (err) {
//         console.error("Prescription Error:", err);
//         res.status(500).json({ error: err.message });
//     }
// });


// router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
// router.post('/upload', upload.single('image'), async (req, res) => {
//     try {
//         console.log("Upload check");
//         if (!req.file) return res.status(400).json({ error: "No image uploaded" });

//         const base64Image = req.file.buffer.toString('base64');

//         // 1. Analyze with Gemini (ensure your geminiService handles the prompt below)
//         const parsed = await analyzeCondition(null, base64Image, req.file.mimetype);

//         // 2. Map AI response to the Database Schema
//         const prescription = new Prescription({
//             // userId: req.body.userId || "demo-user",
//             userId: req.userId,
//             diagnosis: parsed.diagnosis,
//             bodyPart: parsed.bodyPart,
//             severity: parsed.severity,
//             medicines: parsed.medicines || [],
//             dietPlan: parsed.dietPlan || [],
//             exercisePlan: parsed.exercisePlan || [],
//             rawResponse: parsed // Keep the full object for future use
//         });
//         console.log(prescription)

//         await prescription.save();
//         res.json({ success: true, data: prescription });

//     } catch (err) {
//         console.error("Storage Error:", err);
//         res.status(500).json({ error: "AI failed to parse data: " + err.message });
//     }
// });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: "No userId provided" });

    const base64Image = req.file.buffer.toString('base64');

    // Analyze with Gemini
    const parsed = await analyzeCondition(null, base64Image, req.file.mimetype);

    // Save to DB
    const prescription = new Prescription({
      userId: userId,  // <-- now using userId from frontend
      diagnosis: parsed.diagnosis,
      bodyPart: parsed.bodyPart,
      severity: parsed.severity,
      medicines: parsed.medicines || [],
      dietPlan: parsed.dietPlan || [],
      exercisePlan: parsed.exercisePlan || [],
      rawResponse: parsed
    });

    await prescription.save();
    res.json({ success: true, data: prescription });
  } catch (err) {
    console.error("Storage Error:", err);
    res.status(500).json({ error: "AI failed to parse data: " + err.message });
  }
});

// router.get('/:id', authMiddleware, async (req, res) => {
router.get('/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get prescriptions for logged-in user
// router.get('/my', authMiddleware, async (req, res) => {
//     try {
//         const prescriptions = await Prescription
//             .find({ userId: req.userId })
//             .sort({ createdAt: -1 });

//         res.json(prescriptions);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to fetch prescriptions' });
//     }
// });

// router.get('/my', authMiddleware, async (req, res) => {
//   const prescriptions = await Prescription
  
//     .find({ userId: req.userId })
//     .sort({ createdAt: -1 });

//   res.json(prescriptions);
// });

// router.post('/my', authMiddleware, async (req, res) => {
router.post('/my', async (req, res) => {
  const {userId} = req.body;
  const prescriptions = await Prescription
  
    .find({ userId })
    .sort({ createdAt: -1 });

  res.json(prescriptions);
});

module.exports = router;
