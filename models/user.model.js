const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    
    points: { type: Number },
    solved_questions: [{ type: String }],
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const UserModel = mongoose.model("users", userSchema);

module.exports = {
  UserModel,
};
