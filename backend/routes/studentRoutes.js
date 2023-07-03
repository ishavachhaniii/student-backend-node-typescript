const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
  addStudent,
  updateStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
} = require("../controller/studentContrtoller");

// Add student API endpoint
router.post("/student/add", authenticate, addStudent);

// Update student API endpoint
router.put("/student/update/:id", authenticate, updateStudent);

// Delete student API endpoint
router.delete("/student/delete/:id", authenticate, deleteStudent);

// Retrieve all students API endpoint
router.get("/student/all", authenticate, getAllStudents);

// Retrieve a single student by ID API endpoint
router.get("/student/:id", authenticate, getStudentById);

module.exports = router;
