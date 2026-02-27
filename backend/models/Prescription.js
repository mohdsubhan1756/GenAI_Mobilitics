// const mongoose = require('mongoose');

// const PrescriptionSchema = new mongoose.Schema({
//     userId: String,
//     diagnosis: String,
//     bodyPart: String,
//     severity: String,
//     medicines: [String],
//     rawText: String,
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Prescription', PrescriptionSchema);



const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    // userId: { type: String, default: "demo-user" },
    userId: { type: mongoose.Schema.Types.ObjectId },
    diagnosis: String,
    bodyPart: String,
    severity: String,
    // Store arrays for specialized data
    medicines: [String],
    dietPlan: [String],
    exercisePlan: [{
        week: Number,
        intensity: String,
        exercises: [String]
    }],
    rawResponse: Object, // Backup: stores the full AI JSON
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);