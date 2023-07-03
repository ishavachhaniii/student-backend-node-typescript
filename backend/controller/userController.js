const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  validateSignupData,
  validateSigninData,
} = require("../validation/userValidation");

// Signup logic
const signup = async (req, res) => {
  try {
    // Extract relevant information from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      mobileNumber,
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
    });

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
      },
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

// Signin logic
const signin = async (req, res) => {
  try {
    // Extract relevant information from the request body
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
};

module.exports = {
  signup,
  signin,
};