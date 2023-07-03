const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      status: false,
      message: "Unauthorized",
    });
  }

  try {
    const expirationTime = 4 * 60 * 60; // 4 hours in seconds
    const decoded = jwt.verify(token, secretKey, expirationTime);
    
    // Verify if the token has expired
    if (decoded.exp <= Math.floor(Date.now() / 1000)) {
      return res.status(403).json({
        status: false,
        message: "Token expired",
      });
    }
    
    req.studentId = decoded.studentId; // Update to req.studentId
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        status: false,
        message: "Token expired",
      });
    }
    return res.status(403).json({
      status: false,
      message: "Invalid token",
    });
  }
};

module.exports = authenticate;

// const jwt = require("jsonwebtoken");
// const secretKey = process.env.SECRET_KEY;

// const authenticate = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(403).json({
//       status: false,
//       message: "Unauthorized",
//     });
//   }

//   try {
//     // const expirationTime = 4 * 60 * 60; // 4 hours in seconds
//     // const authtoken = jwt.sign(data, secretKey, { expiresIn: expirationTime });
//     // let success = true;
//     // res.json({ success, data, authtoken, expirationTime });

//     const expirationTime = 4 * 60 * 60; // 4 hours in seconds
//     const decoded = jwt.verify(token, secretKey, { expiresIn: expirationTime });
//     req.studentId = decoded.studentId; // Update to req.studentId
//     next();
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return res.status(403).json({
//         status: false,
//         message: "Token expired",
//       });
//     }
//     return res.status(403).json({
//       status: false,
//       message: "Invalid token",
//     });
//   }
// };

// module.exports = authenticate;
