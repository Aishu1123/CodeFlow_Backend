const mongoose = require("mongoose");

const submissionSchema = mongoose.Schema(
  {
    questionID: { type: String },
    code: { type: String },
    userID: { type: String },
    title: { type: String },
    results: [{ testcase: String, expe: String, out: String, pass: Boolean }],
  },
  //  {
  //   testcase: 'AAAAAAAA',
  //   expe: 'AAAAAAAA',
  //   out: 'AAAAAAAA\n',
  //   pass: true
  // }

  {
    versionKey: false,
  }
);

const submissionModel = mongoose.model("submissions", submissionSchema);

module.exports = {
  submissionModel,
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
