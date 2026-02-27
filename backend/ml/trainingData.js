
// const features = [];
// const labels = [];

// // Recovering (0)
// for (let i = 0; i < 50; i++) {
//     features.push([
//         Math.random() * 0.02,           // varianceX: 0–0.02
//         0.05 + Math.random() * 0.2,     // peakToPeakY: 0.05–0.25
//         0.3 + Math.random() * 1.0       // swayFrequency: 0.3–1.3
//     ]);
//     labels.push(0);
// }

// // Stagnant (1)
// for (let i = 0; i < 50; i++) {
//     features.push([
//         0.03 + Math.random() * 0.07,    // varianceX: 0.03–0.1
//         0.3 + Math.random() * 0.4,      // peakToPeakY: 0.3–0.7
//         1.0 + Math.random() * 1.0       // swayFrequency: 1.0–2.0
//     ]);
//     labels.push(1);
// }

// // Regressing (2)
// for (let i = 0; i < 50; i++) {
//     features.push([
//         0.08 + Math.random() * 0.1,     // varianceX: 0.08–0.18
//         0.6 + Math.random() * 0.6,      // peakToPeakY: 0.6–1.2
//         2.0 + Math.random() * 2.0       // swayFrequency: 2.0–4.0
//     ]);
//     labels.push(2);
// }

// module.exports = { features, labels };



// trainingData.js
const features = [];
const labels = [];

// Example: 10 features from accelerometer+gyro (expand as needed)
const NUM_FEATURES = 18; // x,y,z mean/std/energy + correlations

// Recovering (0)
for (let i = 0; i < 50; i++) {
  const row = Array.from({ length: NUM_FEATURES }, () => Math.random() * 0.5); 
  features.push(row);
  labels.push(0);
}

// Stagnant (1)
for (let i = 0; i < 50; i++) {
  const row = Array.from({ length: NUM_FEATURES }, () => 0.5 + Math.random() * 0.5);
  features.push(row);
  labels.push(1);
}

// Regressing (2)
for (let i = 0; i < 50; i++) {
  const row = Array.from({ length: NUM_FEATURES }, () => 1 + Math.random() * 0.5);
  features.push(row);
  labels.push(2);
}

module.exports = { features, labels };