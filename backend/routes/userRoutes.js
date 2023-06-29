const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticate = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const {
  validateSignupData,
  validateSigninData,
  validateUpdateUser,
} = require("../validation/userValidation");

// Signup API endpoint
router.post("/school/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      mobileNumber,
      // profileImage
    } = req.body;

    // Validate signup data
    const signupValidationResult = validateSignupData(req.body);
    if (!signupValidationResult.valid) {
      return res.status(400).json({
        message: "Validation errors",
        errors: signupValidationResult.errors,
        status: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobileNumber,
      // profileImage
    });

    // console.log(user);

    // Store the user data in the session
    // req.session.userData = {
    //   id: user._id,
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    //   email: user.email,
    //   password: user.password,
    //   mobileNumber: user.mobileNumber,
    //   profileImage: user.profileImage
    // };

    // console.log(req.session.userData);

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    res.json({
      status: true,
      message: "User created successfully.",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        // profileImage: user.profileImage
      },
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

// Sign-in API endpoint
router.post("/school/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate signin data
    const signinValidationResult = validateSigninData(req.body);
    if (!signinValidationResult.valid) {
      return res.status(400).json({
        message: "Validation errors",
        errors: signinValidationResult.errors,
        status: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password.");
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

    // Store the user data in the session
    req.session.userData = {
      id: user._id,
      email: user.email,
      password: user.password,
    };
    console.log(req.session.userData);

    res.json({
      status: true,
      message: "User signed in successfully.",
      token,
      userId: user._id,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

// Update user API
router.put("/users/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, mobileNumber } = req.body;

  try {
    const updateValidationResult = validateUpdateUser(req.body);
    if (!updateValidationResult.valid) {
      return res.status(400).json({
        message: "Validation errors",
        errors: updateValidationResult.errors,
        status: false,
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          firstName,
          lastName,
          email,
          mobileNumber,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.json({
      status: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

// Get all users API
router.get("/users", authenticate, async (req, res) => {
  try {
    const users = await User.find();

    res.json({
      status: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

// Get single user API
router.get("/users/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.json({
      status: true,
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

// storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  //   destination: (req, file, cb) => {
  //     const uploadPath = path.join(__dirname, "../images");
  //     fs.mkdirSync(uploadPath, { recursive: true });
  //     cb(null, uploadPath);
  //   },
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

router.post("/upload", authenticate, upload.single("image"), (req, res) => {
  //   console.log(req.file);
  if (!req.file) {
    return res.status(400).json({
      status: false,
      message: "No file uploaded",
    });
  }

  const { originalname, filename, size } = req.file;
  const fileSizeInMB = (size / (1024 * 1024)).toFixed(2);

  if (fileSizeInMB > 5) {
    return res.status(400).json({
      status: false,
      message: "File size exceeds the limit of 5MB",
    });
  }

  res.json({
    status: true,
    message: "File uploaded successfully",
    file: {
      originalname,
      filename,
      size: fileSizeInMB + " MB",
      profile_url: `http://localhost:5000/profile/${req.file.filename}`,
    },
  });
});

// Delete user API
router.delete("/users/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Destroy the session for the deleted user
    // req.session.destroy((err) => {
    //   if (err) {
    //     console.error("Error destroying session:", err);
    //     return res.status(500).json({
    //       status: false,
    //       message: "Internal server error",
    //     });
    //   }

      res.json({
        status: true,
        message: "User deleted successfully",
        user,
      });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});
module.exports = router;
