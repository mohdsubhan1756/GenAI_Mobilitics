const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const { generateConditionKey } = require('../utils/normalizeCase');
const { analyzeCondition } = require('../services/geminiService');

router.post('/analyze', async (req, res) => {
    try {
        console.log("Check");
        const { inputText } = req.body;
        if (!inputText) return res.status(400).json({ error: 'Text required' });

        const conditionKey = generateConditionKey(inputText);

        // 🔍 Check existing case
        const existing = await Case.findOne({ conditionKey });
        if (existing) {
            return res.json({ source: 'cached', data: existing });
        }

        // 🤖 Call Gemini
        // const aiResult = await analyzeCondition(inputText);

        // const newCase = new Case({
        //     conditionKey,
        //     diagnosis: aiResult.diagnosis,
        //     severity: aiResult.severity,
        //     dietPlan: aiResult.dietPlan,
        //     exercisePlan: aiResult.exercisePlan
        // });

        const aiResult = await analyzeCondition(inputText, null);

        // const newCase = new Case({
        //     conditionKey,
        //     diagnosis: aiResult.diagnosis,
        //     severity: aiResult.severity,
        //     dietPlan: aiResult.dietPlan,
        //     exercisePlan: aiResult.exercisePlan
        // });

        // Inside your analyze route
        console.log("AI Data to be saved:", JSON.stringify(aiResult, null, 2));

        const newCase = new Case({
            conditionKey,
            diagnosis: aiResult.diagnosis,
            severity: aiResult.severity,
            dietPlan: aiResult.dietPlan,
            exercisePlan: aiResult.exercisePlan
        });

        const savedCase = await newCase.save();
        console.log("Successfully saved to DB:", savedCase._id);

        await newCase.save();

        res.json({ source: 'gemini', data: newCase });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
