const mongoose =require("mongoose");

const TremorSchema = new mongoose.Schema({

  meanX:Number,
  meanY:Number,
  meanZ:Number,

  stdX:Number,
  stdY:Number,
  stdZ:Number,

  result:String,

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model("TremorTest", TremorSchema);