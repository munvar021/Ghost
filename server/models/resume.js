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

ResumeSchema.index({ text: "text" }); // For full-text search on resume content
ResumeSchema.index({ "qaCache.question": 1 }); // For efficient lookup of questions in cache

module.exports = mongoose.model("Resume", ResumeSchema);
