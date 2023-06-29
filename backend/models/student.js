const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"students",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  // birthdate: {
  //   type: String, // Using the Date type for birthdate
  //   required: true,
  // },
  standard: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["female", "male"],
  },
  email: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  profileImage: {
    type: String,
  //  required: true,
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
