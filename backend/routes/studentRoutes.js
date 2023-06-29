const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const authenticate = require("../middleware/authMiddleware");
const {
  validateStudentData,
  validateUpdateStudentData,
} = require("../validation/studentValidation");
const multer = require("multer");
const path = require("path");

// Storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Multer file upload configuration
const upload = multer({
  storage: storage,
  dest: "upload/images",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."));
    }
  },
});

// Middleware function to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "No token provided.",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({
          status: false,
          message: "Token expired.",
        });
      }
      return res.status(403).json({
        status: false,
        message: "Failed to authenticate token.",
      });
    }

    req.studentId = decoded.studentId;
    next();
  });
};

// Add student API endpoint
router.post(
  "/student/add",
  authenticate,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        // birthdate,
        standard,
        gender,
        email,
        mobileNumber,
        profileImage,
      } = req.body;

      // Validate student data
      const validationResult = validateStudentData(req.body);

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

      // let profileImage = "";
      if (req.file) {
        profileImage = req.file.path;
      }

      // Create a new student
      const student = new Student({
        firstName,
        lastName,
        // birthdate,
        standard,
        gender,
        email,
        mobileNumber,
        profileImage,
      });

      await student.save();

      // Generate a token
      const token = jwt.sign(
        { studentId: student._id },
        process.env.SECRET_KEY,
        { expiresIn: "4h" }
      );

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
  }
);

// Update student API endpoint
router.put(
  "/student/update/:id",
  authenticate,
  verifyToken,
  // upload.single("profileImage"),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        // age,
        standard,
        gender,
        email,
        mobileNumber,
        profileImage
      } = req.body;

      const studentId = req.params.id;

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

      student.firstName = firstName;
      student.lastName = lastName;
      // student.age = age;
      student.standard = standard;
      student.gender = gender;
      student.email = email;
      student.mobileNumber = mobileNumber;
      student.profileImage = profileImage;

      if (req.file) {
        student.profileImage = req.file.path;
      }

      await student.save();

      res.json({
        status: true,
        message: "Student updated successfully.",
        student,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
);

// Delete student API endpoint
router.delete(
  "/student/delete/:id",
  authenticate,
  verifyToken,
  async (req, res) => {
    try {
      const studentId = req.params.id;

      const student = await Student.findByIdAndDelete(studentId);

      if (!student) {
        return res.status(404).json({
          status: false,
          message: "Student not found",
        });
      }

      res.json({
        status: true,
        message: "Student deleted successfully.",
        student,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
);

// Retrieve all students API endpoint (with pagination and search params)
router.get("/student/all", authenticate, verifyToken, async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const searchRegex = new RegExp(search || "", "i");

    const filter = {
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ],
    };

    const mobileNumber = parseInt(search);
    if (!isNaN(mobileNumber)) {
      filter.$or.push({ mobileNumber });
    }

    const countPromise = Student.countDocuments(filter);
    const studentsPromise = Student.find(filter)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const [totalCount, students] = await Promise.all([
      countPromise,
      studentsPromise,
    ]);

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
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

// Retrieve a single student by ID API endpoint
router.get("/student/:id", authenticate, verifyToken, async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId);

    if (!student) {
      throw new Error("Student not found.");
    }

    res.json({
      status: true,
      message: "Student retrieved successfully.",
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
