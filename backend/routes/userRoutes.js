const express = require("express");
const router = express.Router();
const { signin, signup } = require("../controller/userController")

// Signup API endpoint
router.post("/school/signup", signup);

// Sign-in API endpoint
router.post("/school/signin", signin);

module.exports = router;