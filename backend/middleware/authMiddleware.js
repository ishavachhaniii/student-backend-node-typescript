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
//     const decoded = jwt.verify(token, secretKey);
//     req.userId = decoded.userId;
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
    const decoded = jwt.verify(token, secretKey);
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

// // Authentication middleware
// const authenticate = (req, res, next) => {
// //   const token = req.header("Authorization");
// //   if (!token) {
// //     return res.status(401).json({
// //       status: false,
// //       message: "Unauthorized",
// //     });
// //   }
// //   try {
// //     const decoded = jwt.verify(token, secretKey);
// //     req.userId = decoded.userId;
// //     next();
// //   } catch (error) {
// //     return res.status(401).json({
// //       status: false,
// //       message: "Invalid token",
// //     });
// //   }
// // };
// const token = req.session.token; // Retrieve the token from the session
// if (!token) {
//   return res.status(401).json({
//     status: false,
//     message: "Unauthorized",
//   });
// }
// try {
//   const decoded = jwt.verify(token, secretKey);
//   req.userId = decoded.userId;
//   next();
// } catch (error) {
//   return res.status(401).json({
//     status: false,
//     message: "Invalid token",
//   });
// }
// };

// module.exports = authenticate;