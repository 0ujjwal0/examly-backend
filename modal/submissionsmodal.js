const mongoose = require("mongoose");

const selectionSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  option: { type: String, required: true },
  savedAt: { type: Date, default: Date.now },
});

const submissionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    selections: [selectionSchema],
    isDeleted: { type: Boolean, default: false },
    isGraded: { type: Boolean, default: false },
    marks: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
