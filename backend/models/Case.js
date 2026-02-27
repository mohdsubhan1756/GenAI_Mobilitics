// const mongoose = require('mongoose');

// const CaseSchema = new mongoose.Schema({
//     conditionKey: { type: String, unique: true },
//     diagnosis: String,
//     severity: String,
//     dietPlan: [String],
//     exercisePlan: [
//         {
//             week: Number,
//             exercises: [String],
//             intensity: String
//         }
//     ],
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Case', CaseSchema);


const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
    conditionKey: { type: String, required: true, unique: true },
    diagnosis: String,
    severity: String,
    dietPlan: [String], // Ensure this is an array of strings
    exercisePlan: [
        {
            week: Number,
            intensity: String,
            exercises: [String]
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', CaseSchema);