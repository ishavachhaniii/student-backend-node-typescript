const multer = require("multer");
const path = require("path");

// Storage engine
const storage = multer.diskStorage({
  destination: "./upload/images", // Specify the destination folder
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
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, and JPG are allowed."
        )
      );
    }
  },
});

module.exports = upload;

// const multer = require('multer');
// const path = require('path');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadPath = path.join(__dirname, '../images/');
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split("/")[1];
//         cb(null, `image-${file.fieldname}-${Date.now()}.${ext}`);
//     },
// });

// // const upload = multer({ storage: multerStorage });

// const upload = multer({ dest: 'uploads/' })

// const uploadImage = upload.single('imgUrl');

// module.exports = uploadImage;

