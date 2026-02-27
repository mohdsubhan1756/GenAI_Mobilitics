const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    varianceX: Number,
    peakToPeakY: Number,
    swayFrequency: Number,
    stabilityScore: Number,
    status: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Test', TestSchema);
