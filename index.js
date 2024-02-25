const express = require("express");
require("dotenv").config();
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");
const { questionRouter } = require("./routes/question.route");
const { QuestionModel } = require("./models/question.model");
const { auth } = require("./middleware/auth.middleware");
const cors = require("cors");
const { compileRouter } = require("./routes/compiler.route");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/questions", questionRouter);
app.use("/compile", compileRouter);

app.get("/", (req, res) => {
  res.send("Welcome to home page");
});

app.get("/questions", auth, async (req, res) => {
  const questions = await QuestionModel.find();
  res.status(200).send({ questions });
});

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log(`Server is running at http://localhost:${process.env.port}`);
    console.log(`ajncsdnsdv ${process.env.mongoURL}`);
    console.log("codeFlow database is connected..");
  } catch (err) {
    console.log(err);
  }
});
