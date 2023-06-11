const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Add Title"],
    },
    author: {
      type: String,
      required: [true, "Please Add Author"],
    },
    price: {
        type: Number,
        required:[true, 'Please Add Price']
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);

