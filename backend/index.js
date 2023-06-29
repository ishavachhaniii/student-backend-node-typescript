require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const bodyParser = require('body-parser');
const routes = require('./routes/userRoutes');
const image = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const studentRoutes = require('./routes/studentRoutes');
const session = require("express-session");

const app = express();

// Connect to MongoDB
connectDB();

// CORS middleware
const cors = require("cors");
app.use(cors());

// Add the express-session middleware
app.use(
  session({
    secret: "SECRET_KEY",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400000, // Set the session to expire after 24 hours (optional)
    },
  })
);

// Enable JSON body parsing and set limit option
app.use(bodyParser.json({ limit: "10mb" }));

// Import and use the router that contains your routes
app.use(routes);
// app.use(image);
app.use(postRoutes);
app.use(studentRoutes);

// Multer file upload destination
app.use('/profile', express.static('upload/images'));

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});