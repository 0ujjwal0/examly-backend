const mongoose = require("mongoose");

const testSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model("Test", testSchema);
module.exports = Test;
