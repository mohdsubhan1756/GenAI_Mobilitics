// const express = require("express");
// const TremorTest = require("../models/TremorTest.js");
// const analyzeTremor = require("../ml/tremorModel.js");

// const router = express.Router();

// router.post("/predict", async (req, res) => {

//   try {

//     const features = req.body;

//     if (
//       features.meanX === undefined ||
//       features.meanY === undefined ||
//       features.meanZ === undefined ||
//       features.stdX === undefined ||
//       features.stdY === undefined ||
//       features.stdZ === undefined
//     ) {
//       return res.status(400).json({ error: "Invalid sensor data" });
//     }

//     const signal = [
//       Number(features.stdX),
//       Number(features.stdY),
//       Number(features.stdZ),
//       Number(features.meanX),
//       Number(features.meanY),
//       Number(features.meanZ)
//     ];

//     const result = analyzeTremor(signal);

//     const test = await TremorTest.create({
//       ...features,
//       result
//     });

//     res.json({
//       result,
//       id: test._id
//     });

//   } catch (err) {

//     console.log(err);

//     res.status(500).json({
//       error: "Prediction Failed"
//     });

//   }

// });

// module.exports = router;






const express = require("express");
const TremorTest = require("../models/TremorTest.js");
const analyzeTremor = require("../ml/tremorModel.js");

const router = express.Router();

router.post("/predict", async (req, res) => {

    try {

        const features = req.body;

        if (
            features.meanX === undefined ||
            features.meanY === undefined ||
            features.meanZ === undefined ||
            features.stdX === undefined ||
            features.stdY === undefined ||
            features.stdZ === undefined
        ) {
            return res.status(400).json({
                error: "Invalid sensor data"
            });
        }


        const result = analyzeTremor(features);

        const test = await TremorTest.create({
            ...features,
            result: result.severity
        });

        res.json({
            result: result.severity,
            tremorScore: result.tremorScore,
            affectedPercentage: result.affectedPercentage,
            id: test._id
        });


    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Prediction Failed"
        });

    }

});

router.get("/history", async (req,res)=>{
  const history = await TremorTest.find().sort({createdAt:-1}).limit(20);
  res.json(history);
});

module.exports = router;