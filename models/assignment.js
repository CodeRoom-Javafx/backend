const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  problemStatement: {
    type: String,
    required: true,
  },
  submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
    },
  ],
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
