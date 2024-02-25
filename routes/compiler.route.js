const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const app = express();
const fs = require("fs");
app.use(bodyParser.json());
const path = require("path");
const readline = require("readline");

const { QuestionModel } = require("../models/question.model");
const compileRouter = express.Router();

compileRouter.post("/solve", async (req, res) => {
  let { language, code, customInput } = req.body;
 
  const testCaseOP = [];
  switch (language) {
    case "java": {
      const errors = [];
      try {
        fs.writeFile("main.java", code, (err) => {
          if (err) {
            errors.push({ err });
            res.status(500).json({ error: "Error writing Java file" });
            return;
          } else {
            try {
              exec("javac main.java", (err, stdout, stderr) => {
                if (err) {
                  res
                    .status(500)
                    .json({ error: "Compilation error", err, stderr, stdout });
                  return;
                } else {
                  customInput = customInput.replaceAll("\n", " ");
                  try {
                    exec(
                      `echo ${customInput} | java main`,
                      (err, stdout, stderr) => {
                        if (err) {
                          errors.push({ err });
                          res.status(500).json({
                            error: "Execution error",
                            stderr,
                            stdout,
                          });
                          return;
                        } else {
                          // res.send([{ language: "Java", output: stdout }]);
                          console.log(stdout);
                          if (customInput) {
                            testCaseOP.push({
                              language: "Java",
                              output: stdout,
                            });
                          } else {
                            testCaseOP.push({
                              language: "Java",
                              output: "",
                            });
                          }
                          res.send({
                            language: "Java",
                            output: testCaseOP,
                          });
                          return;
                        }
                      }
                    );
                  } catch (error) {
                    errors.push({ error });
                  }
                }
              });
            } catch (error) {
              errors.push({ error });
            }
          }
        });
      } catch (error) {
        errors.push({ error });
      }
      return;
    }
    case "python": {
      fs.writeFile("python.py", code, (err) => {
        if (err) {
          //console.error(err);
          res.status(500).json({ error: "Error writing Python file" });
          return;
        }
        // const stdin = customInput.replaceAll(" ", "\n");
        const inputs = customInput.split(" ");
        const processssss = exec(`python  python.py`, (err, stdout, stderr) => {
          if (err) {
            res.status(500).json({ error: "Execution error", stderr });
            return;
          }
          testCaseOP.push({
            language: "python",
            output: stdout,
          });
          res.send({
            language: "python",
            output: testCaseOP,
          });
          return;
          // res.send([{ language: "Python", output: stdout }]);
        });
        inputs.forEach((input) => {
          processssss.stdin.write(input + "\n");
        });
        processssss.stdin.end();
      });
      return;
    }
    case "javascript": {
      console.log(req.body);
      try {
        const code = req.body.code;
        const inputs = customInput;

        let logOutput = "";
        const originalLog = console.log;
        console.log = function (...args) {
          logOutput += args.join(" ") + "\n";
        };

        const result = await eval(code, inputs);
        console.log("RESULT : ", result);
        console.log = originalLog;

        testCaseOP.push({
          input: inputs,
          log: logOutput,
        });
        console.log("testcaesa OP ", testCaseOP);
        res.status(200).json(testCaseOP);
      } catch (err) {
        res.status(500).json({ error: "Execution error", stderr: err.message });
      }

      //   try {
      //     const result = await eval(code);
      //     testCaseOP.push({
      //       language: "javascript",
      //       result,
      //       // log: originalLog,
      //     });
      //     res.send({
      //       language: "javascript",
      //       output: testCaseOP,
      //     });
      //     return;
      //     // res.send([{ language: "JavaScript", output: result }]);
      //   } catch (err) {
      //     //console.error(err);
      //     res
      //       .status(500)
      //       .json({ error: "Execution  sdad error", stderr: err.message });
      //   }
      //   return;
      // }
      // default: {
      //   res.send({ msg: "Please select language" });
      //   return;
    }
  }
});

compileRouter.post("/submit", async (req, res) => {
  let { language, code, customInput, questionId } = req.body;
  // console.log(language);
  // console.log(code);
  // console.log(customInput);
  const question = await QuestionModel.findOne({
    _id: questionId,
  });
  const errors = [];
  const testCaseOP = [];
  switch (language) {
    case "java": {
      try {
        fs.writeFile("main.java", code, (err) => {
          if (err) {
            errors.push({ err });
            res.status(500).json({ error: "Error writing Java file" });
            return;
          } else {
            try {
              exec("javac main.java", (err, stdout, stderr) => {
                if (err) {
                  res
                    .status(500)
                    .json({ error: "Compilation error", err, stderr, stdout });
                  return;
                } else {
                  for (let i = 0; i < question.testCases.length; i++) {
                    customInput = question.testCases[i].inp;
                    customInput = customInput.replaceAll("\n", " ");
                    try {
                      exec(
                        `echo ${customInput} | java main`,
                        (err, stdout, stderr) => {
                          if (err) {
                            errors.push({ err });
                            res.status(500).json({
                              error: "Execution error",
                              stderr,
                              stdout,
                            });
                            return;
                          } else {
                            testCaseOP.push({
                              language: "Java",
                              output: stdout,
                              // testCases: question.testCases,
                              inp: question.testCases[i].inp,
                            });
                            if (
                              testCaseOP.length == question.testCases.length
                            ) {
                              res.send({
                                language: "Java",
                                output: testCaseOP,
                              });
                              // res.send(testCaseOP);
                            } else if (errors.length > 1) {
                              res.send(errors);
                            }
                            // res.send({ language: "Java", output: stdout });
                            // return;
                          }
                        }
                      );
                    } catch (error) {
                      errors.push({ error });
                    }
                  }
                }
              });
            } catch (error) {
              errors.push({ error });
            }
          }
        });
      } catch (error) {
        errors.push({ error });
      }
      return;
    }
    case "python": {
      let responseSent = false;
      try {
        fs.writeFile("python.py", code, (err) => {
          if (err) {
            errors.push({ error: "Error writing Python file" });
            res.status(500).json({ error: "Error writing Python file" });
            return;
          } else {
            try {
              for (var i = 0; i < question.testCases.length; i++) {
                const inputs = question.testCases[i].inp.split(" ");
                const processssss = exec(
                  `python  python.py`,
                  (err, stdout, stderr) => {
                    if (err) {
                      errors.push({ error: "Execution error", stderr });
                      // res
                      //   .status(500)
                      //   .json({ error: "Execution error", stderr });
                      // return;
                    }
                    testCaseOP.push({ language: "Python", output: stdout });
                    if (testCaseOP.length == question.testCases.length) {
                      res.send({ language: "Python", output: testCaseOP });
                      responseSent = true;
                      return;
                    } else if (
                      errors.length == question.testCases.length &&
                      !responseSent
                    ) {
                      res.send(errors);
                    }
                  }
                );
                inputs.forEach((input) => {
                  processssss.stdin.write(input + "\n");
                });
                processssss.stdin.end();
              }
            } catch (error) {
              errors.push({ error });
            }
          }
        });
      } catch (error) {
        errors.push({ error });
      }
      return;
    }
    case "javascript": {
      try {
        const result = await eval(code);
        res.send({ language: "JavaScript", output: result });
      } catch (err) {
        //console.error(err);
        res.status(500).json({ error: "Execution error", stderr: err.message });
      }
      return;
    }
    default: {
      res.send({ msg: "Please select language" });
      return;
    }
  }
});

compileRouter.post("/submit222222222", async (req, res) => {
  let { language, code, customInput, questionId } = req.body;
  // console.log(language);
  // console.log(code);
  // console.log(customInput);
  const question = await QuestionModel.findOne({
    _id: questionId,
  });
  const errors = [];
  const testCaseOP = [];
  let resultOutput = [];
  switch (language) {
    case "java": {
      try {
        fs.writeFile("main.java", code, (err) => {
          if (err) {
            errors.push({ err });
            res.status(500).json({ error: "Error writing Java file" });
            return;
          } else {
            try {
              exec("javac main.java", (err, stdout, stderr) => {
                if (err) {
                  res
                    .status(500)
                    .json({ error: "Compilation error", err, stderr, stdout });
                  return;
                } else {
                  for (let i = 0; i < question.testCases.length; i++) {
                    customInput = question.testCases[i].inp;
                    customInput = customInput.replaceAll("\n", " ");
                    try {
                      exec(
                        `echo ${customInput} | java main`,
                        (err, stdout, stderr) => {
                          if (err) {
                            errors.push({ err });
                            res.status(500).json({
                              error: "Execution error",
                              stderr,
                              stdout,
                            });
                            return;
                          } else {
                            testCaseOP.push({
                              language: "Java",
                              output: stdout,
                              // testCases: question.testCases,
                              inp: question.testCases[i].inp,
                            });

                            resultOutput.push({
                              inp: question.testCases[i].inp,
                              expe: question.testCases[i].oup,
                              stdout,
                            });
                            if (
                              testCaseOP.length == question.testCases.length
                            ) {
                              res.send({
                                // language: "Java",
                                // output: testCaseOP,
                                output: resultOutput,
                              });
                              // res.send(testCaseOP);
                            } else if (errors.length > 1) {
                              res.send(errors);
                            }
                            // res.send({ language: "Java", output: stdout });
                            // return;
                          }
                        }
                      );
                    } catch (error) {
                      errors.push({ error });
                    }
                  }
                }
              });
            } catch (error) {
              errors.push({ error });
            }
          }
        });
      } catch (error) {
        errors.push({ error });
      }
      return;
    }
    case "python": {
      let responseSent = false;
      try {
        fs.writeFile("python.py", code, (err) => {
          if (err) {
            errors.push({ error: "Error writing Python file" });
            res.status(500).json({ error: "Error writing Python file" });
            return;
          } else {
            try {
              for (var i = 0; i < question.testCases.length; i++) {
                const inputs = question.testCases[i].inp.split(" ");
                const processssss = exec(
                  `python  python.py`,
                  (err, stdout, stderr) => {
                    if (err) {
                      errors.push({ error: "Execution error", stderr });
                      // res
                      //   .status(500)
                      //   .json({ error: "Execution error", stderr });
                      // return;
                    }
                    testCaseOP.push({ language: "Python", output: stdout });
                    if (testCaseOP.length == question.testCases.length) {
                      res.send({ language: "Python", output: testCaseOP });
                      responseSent = true;
                      return;
                    } else if (
                      errors.length == question.testCases.length &&
                      !responseSent
                    ) {
                      res.send(errors);
                    }
                  }
                );
                inputs.forEach((input) => {
                  processssss.stdin.write(input + "\n");
                });
                processssss.stdin.end();
              }
            } catch (error) {
              errors.push({ error });
            }
          }
        });
      } catch (error) {
        errors.push({ error });
      }
      return;
    }
    case "javascript": {
      try {
        const result = await eval(code);
        res.send({ language: "JavaScript", output: result });
      } catch (err) {
        //console.error(err);
        res.status(500).json({ error: "Execution error", stderr: err.message });
      }
      return;
    }
    default: {
      res.send({ msg: "Please select language" });
      return;
    }
  }
});

module.exports = { compileRouter };

// https://vivmagarwal.notion.site/Readme-Template-c308679e49464cfe9bb86043a4b73da1
// https://www.gitkraken.com/learn/git/best-practices/git-commit-message

// tc = int(input())
// for _ in range(tc):
//     n = int(input())
//     arr = []
//     for _ in range(n):
//         arr.append(int(input()))
//     x = 0
//     for i in range(n):
//         x += arr[i]
//     print("SUM OF ARRAY is", x)

//   import java.util.Scanner;
//   public class main {
//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);
//         int tc = sc.nextInt();
//         while(tc-- > 0){
//            int n = sc.nextInt();
//          int[] arr = new int[n];
//          for(int i = 0; i<n;i++){
//           arr[i] = sc.nextInt();
//          }
//          int x = 0;
//          for(int i = 0; i<n;i++){
//           System.out.println(x);
//           x += arr[i];
//          }
//          System.out.println("SUM OF ARRAY is" + x);
//         }
//     }
// }

// y = int(input());
// x = int(input());
// print(x + y);
