const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  roomsJoined: [{
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    assignments: [{
      assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
      },
      submissionStatus: {
        type: Boolean,
        ref: "Submission",
        required: true
      },
      submissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission",
        required: true
      },
      marks: {
        type: Number,
        required: true
      }
    }]
  }]
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
