const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  sourceCode: {
    type: String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  studentStatus: {
    type: Boolean,
    default: false,
  },
  teacherStatus: {
    type: Boolean,
    default: false,
  },
});

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
