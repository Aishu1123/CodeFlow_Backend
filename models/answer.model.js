const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({

userID:{type: String, required: true},
 questionID:{type: String, required: true},
  answer: {
    type: String,
    required: true
  },
},
{
    versionKey: false,
  });

const AnswerModel = mongoose.model("answers", answerSchema);

module.exports = {
  AnswerModel
};
