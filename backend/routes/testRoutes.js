const express = require('express');
const router = express.Router();
const { rf, labelMap } = require('../ml/model');
const Test = require('../models/Test');

router.post('/add', async (req, res) => {
    console.log("Check");
    try {
        const { userId, varianceX, peakToPeakY, swayFrequency, stabilityScore } = req.body;

        // Predict numeric status
        const predictionNum = rf.predict([[varianceX, peakToPeakY, swayFrequency]])[0];

        // Decode to string
        const predictionStr = labelMap[predictionNum];
        console.log("Req.body", req.body);

        const test = new Test({
            userId,
            varianceX,
            peakToPeakY,
            swayFrequency,
            stabilityScore,
            status: predictionStr,
            createdAt: new Date()
        });

        await test.save();

        res.json({ status: predictionStr });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// router.get('/', async (req, res) => {
//     try {
//         const {userId} = req.body;
//         console.log("/", req.body);
//         const tests = await Test.find({userId}).sort({ createdAt: -1 });
//         res.json(tests);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

router.post('/', async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("/", req.body);
        const tests = await Test.find({ userId }).sort({ createdAt: -1 });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
