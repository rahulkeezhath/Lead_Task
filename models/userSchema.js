const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Add Username"],
    },
    password: {
      type: String,
      required: [true, "Please Add Password"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Please Add Email"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
