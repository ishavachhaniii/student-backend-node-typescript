const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  postImageURL: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

const Post = mongoose.model("Post", postSchema)

module.exports = Post
