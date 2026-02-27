const { fft } = require("fft-js");
const fftUtil = require("fft-js").util;

function analyzeTremor(features){

  const score = Math.sqrt(
    features.stdX**2 +
    features.stdY**2 +
    features.stdZ**2
  );

  let severity;
  let percentage;

  if(score < 0.01){
    severity = "Stable";
    percentage = 5;
  }
  else if(score < 0.07){
    severity = "Normal Hand Stability";
    percentage = 15;
  }
  else if(score < 0.20){
    severity = "Mild Tremor";
    percentage = 35;
  }
  else if(score < 0.45){
    severity = "Moderate Tremor";
    percentage = 60;
  }
  else{
    severity = "Severe Tremor";
    percentage = 90;
  }

  return {
    severity,
    tremorScore: score,
    affectedPercentage: percentage
  };
}


module.exports = analyzeTremor;