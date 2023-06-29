const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authMiddleware");
const {
  validateAddData,
  validateUpdateUser,
  validateComment,
} = require("../validation/postValidation");
const Post = require("../models/post");
const Comment = require("../models/comment");
const multer = require("multer");
const path = require("path");

// Create post API
router.post("/addPost", async (req, res) => {
  try {
    const { name, description, postImageURL, location } = req.body;

    // Validate post data
    const { valid, errors } = validateAddData(req.body);
    if (!valid) {
      return res.status(400).json({
        status: false,
        errors,
      });
    }

    // Create a new post
    const post = new Post({
      name,
      description,
      // postImageURL,
      location,
    });

    await post.save();

    // Generate JWT token
    const token = jwt.sign({ postId: post._id }, process.env.SECRET_KEY);

    res.status(201).json({
      status: true,
      message: "Post created successfully.",
      post,
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

// Update post API
router.put("/post/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, description, postImageURL, location } = req.body;

  // Validate post data
  const { valid, errors } = validateUpdateUser(req.body);
  if (!valid) {
    return res.status(400).json({
      status: false,
      errors,
    });
  }

  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          description,
          postImageURL,
          location,
        },
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }

    res.json({
      status: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

// Get all posts API
router.get("/posts", authenticate, async (req, res) => {
  try {
    // const posts = await Post.find();
    // const posts = await Post.find().populate('comments');
    const posts = await Post.find().populate({
      path: "comments",
      select: "-postId", // Exclude the postId field from comments
    });

    // Map the posts array to include the upload post URL
    const postsWithUploadURL = posts.map((post) => {
      const postImageURL = `http://localhost:5000/profile/${post.postImageURL}`;
      return { ...post._doc, postImageURL };
    });

    res.json({
      status: true,
      message: "posts retrieved successfully",
      posts: postsWithUploadURL,
    });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

// Get single post API
router.get("/post/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    // const post = await Post.findById(id);
    // const post = await Post.findById(id).populate('comments');
    const post = await Post.findById(id).populate({
      path: "comments",
      select: "-postId", // Exclude the postId field from comments
    });

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }

    res.json({
      status: true,
      message: "Post retrieved successfully",
      post,
    });
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

// Delete post API
router.delete("/post/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }

    const postImageURL = `http://localhost:5000/profile/${post.postImageURL}`;

    res.json({
      status: true,
      message: "Post deleted successfully",
      post: { ...post._doc, postImageURL },
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

// Add comment API
router.post("/comment/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const post = await Post.findById(id);

    // Validate post data
    const { valid, errors } = validateComment(req.body);
    if (!valid) {
      return res.status(400).json({
        status: false,
        errors,
      });
    }

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
      });
    }

    // Add new comment
    const comment = new Comment({
      postId: post._id,
      name,
      description,
    });

    await comment.save();

    post.comments = post.comments || [];
    post.comments.push(comment);
    await post.save();

    res.status(201).json({
      status: true,
      message: "Comment created successfully.",
      comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

// Get all comments API
router.get("/comments", authenticate, async (req, res) => {
  try {
    const comments = await Comment.find();

    res.json({
      status: true,
      message: "Comments retrieved successfully",
      comments,
    });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

// Delete comment API
router.delete("/comment/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({
        status: false,
        message: "Comment not found",
      });
    }

    res.json({
      status: true,
      message: "Comment deleted successfully",
      comment,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

// storage engine
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

router.post(
  "/postupload/:id",
  authenticate,
  upload.single("image"),
  async (req, res) => {
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

    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          status: false,
          message: "Post not found",
        });
      }

      post.postImageURL = req.file.filename;
      await post.save();

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
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  }
);

module.exports = router;
