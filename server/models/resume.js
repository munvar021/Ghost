const mongoose = require("mongoose");

const QACacheSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const ResumeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  qaCache: [QACacheSchema],
});

module.exports = mongoose.model("Resume", ResumeSchema);
