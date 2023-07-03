const express = require("express");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const {
  validateStudentData,
  validateUpdateStudentData,
} = require("../validation/studentValidation");

// Add student API endpoint
const addStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      standard,
      divison,
      gender,
      email,
      mobileNumber,
      address,
      profileImage,
    } = req.body;


    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      throw new Error("Email already exists.");
    }

    // Create a new student
    const student = new Student({
      firstName,
      lastName,
      standard,
      divison,
      gender,
      email,
      mobileNumber,
      address,
      profileImage
    });

    // Validate student data
      const validationResult = validateStudentData(req.body);

      if (!validationResult.valid) {
        return res.status(400).json({
          status: false,
          message: "Validation errors",
          errors: validationResult.errors,
        });
      }

    await student.save();

     // Generate a token
     const token = jwt.sign({ studentId: student._id }, process.env.SECRET_KEY, {
      expiresIn: "4h",
    });


    res.json({
      status: true,
      message: "Student added successfully.",
      student,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

// Update student API endpoint
const updateStudent = async (req, res) => {
  try {
    // Retrieve the student ID from the request parameters
    const studentId = req.params.id;

    // Retrieve the updated student data from the request body
    const {
      firstName,
      lastName,
      standard,
      division,
      gender,
      email,
      mobileNumber,
      address,
      profileImage,
    } = req.body;
    
    // Validate student data
    const validationResult = validateUpdateStudentData(req.body);

    if (!validationResult.valid) {
      return res.status(400).json({
        status: false,
        message: "Validation errors",
        errors: validationResult.errors,
      });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      throw new Error("Email already exists.");
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error("Student not found.");
    }

    // Update the student object with the new data
    student.firstName = firstName;
    student.lastName = lastName;
    student.standard = standard;
    student.division = division;
    student.gender = gender;
    student.email = email;
    student.mobileNumber = mobileNumber;
    student.address = address;
    student.profileImage = profileImage;

    // Save the updated student object to the database
    await student.save();

    // Return a response indicating success
    res.json({
      status: true,
      message: "Student updated successfully.",
      student,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

// Delete student API endpoint
const deleteStudent = async (req, res) => {
  try {
    // Retrieve the student ID from the request parameters
    const studentId = req.params.id;

    // Find the student by ID and delete it
    const deletedStudent = await Student.findByIdAndDelete(studentId);

    // Check if the student exists
    if (!deletedStudent) {
      return res.status(404).json({
        status: false,
        message: "Student not found",
      });
    }

    // Return a response indicating success
    res.json({
      status: true,
      message: "Student deleted successfully.",
      student: deletedStudent,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error deleting student:", error);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

// Retrieve all students API endpoint
const getAllStudents = async (req, res) => {
  try {
    // Retrieve the page, limit, and search query from the request query parameters
    const { page, limit, search } = req.query;

    // Parse the page and limit values
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    // Create a regular expression object to search by name or email
    const searchRegex = new RegExp(search || "", "i");

    // Build the filter object for the search query
    const filter = {
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ],
    };

    // Retrieve the total count of students matching the filter
    const totalCount = await Student.countDocuments(filter);

    // Retrieve the students based on the filter, page, and limit
    const students = await Student.find(filter)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Return a response with the retrieved students and pagination information
    res.json({
      status: true,
      message: "Students retrieved successfully.",
      data: {
        students,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

// Retrieve a single student by ID API endpoint
const getStudentById = async (req, res) => {
  try {
    // Retrieve the student ID from the request parameters
    const studentId = req.params.id;

    // Retrieve the student by ID
    const student = await Student.findById(studentId);

    // Check if the student exists
    if (!student) {
      throw new Error("Student not found.");
    }

    // Return a response with the retrieved student
    res.json({
      status: true,
      message: "Student retrieved successfully.",
      data: student,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  addStudent,
  updateStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
};
