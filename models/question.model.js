const mongoose = require("mongoose");

const questionSchema = mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    testCases: [
      {
        inp: { type: String },
        oup: { type: String },
      },
    ],
    points: { type: Number, default: 0 },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
    topics: [{ type: String }],
    constraints: [{ type: String }],
  },
  {
    versionKey: false,
  }
);

const QuestionModel = mongoose.model("questions", questionSchema);

module.exports = {
  QuestionModel,
};

// {title:"Sum of Two Numbers",
// description: "Find Sum of two Numbers",
// testCases: [
//   {
//     inp: "1 2",
//     oup: "3",
//   },{
//     inp: "4 5",
//     oup: "9",
//   },{
//     inp: "7 9",
//     oup: "16",
//   },{
//     inp: "15 41",
//     oup: "56",
//   },
// ],
// points: 10,
// difficulty:"easy",
// topics: ["sum", "inputs"] }
