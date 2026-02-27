// const { RandomForestClassifier } = require('ml-random-forest');
// const { features, labels } = require('./trainingData');

// if (!features.length || !labels.length) throw new Error('Training data is empty!');

// const rf = new RandomForestClassifier({
//     seed: 3,
//     maxFeatures: 3,
//     replacement: true,
//     nEstimators: 50, // smaller for smaller dataset
// });

// rf.train(features, labels);

// const labelMap = {
//     0: 'Recovering',
//     1: 'Stagnant',
//     2: 'Regressing'
// };

// function predict(featuresInput) {
//     if (!Array.isArray(featuresInput) || featuresInput.length !== 3) {
//         throw new Error('featuresInput must be [varianceX, peakToPeakY, swayFrequency]');
//     }
//     const pred = rf.predict([featuresInput])[0];
//     return labelMap[pred];
// }

// module.exports = { rf, labelMap, predict };





const { RandomForestClassifier } = require('ml-random-forest');
const { features, labels } = require('./trainingData');

if (!features.length || !labels.length) throw new Error('Training data is empty!');

const rf = new RandomForestClassifier({
  seed: 3,
  maxFeatures: features[0].length,
  replacement: true,
  nEstimators: 100,
});

rf.train(features, labels);

const labelMap = {
  0: 'Recovering',
  1: 'Stagnant',
  2: 'Regressing',
};

function predict(featuresInput) {
  if (!Array.isArray(featuresInput) || featuresInput.length !== features[0].length) {
    throw new Error(`featuresInput must be length ${features[0].length}`);
  }
  const pred = rf.predict([featuresInput])[0];
  return labelMap[pred];
}

module.exports = { rf, labelMap, predict };