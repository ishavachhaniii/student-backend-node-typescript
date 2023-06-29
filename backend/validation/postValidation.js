const validator = require("validator");

exports.validateAddData = (data) => {
  const { name, description, postImageURL, location } = data;

  const errors = {};

  if (!name || !validator.isLength(name, { min: 5 })) {
    errors.name = "Name must be at least 5 characters long.";
  }

  if (!description || !validator.isLength(description, { min: 5 })) {
    errors.description = "Description must be at least 5 characters long.";
  }

  // if (!postImageURL || !validator.isLength(postImageURL, { min: 5 })) {
  //   errors.postImageURL = "Post Image URL must be at least 5 characters long.";
  // }

  if (!location || !validator.isLength(location, { min: 4 })) {
    errors.location = "Location must have a valid format.";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

exports.validateUpdateUser = (data) => {
  const { name, description, location } = data;

  const errors = {};

  if (!name || !validator.isLength(name, { min: 5 })) {
    errors.name = "Name must be at least 5 characters long.";
  }

  if (!description || !validator.isLength(description, { min: 5 })) {
    errors.description = "Description must be at least 5 characters long.";
  } 

  if (!location || !validator.isLength(description, { min: 4 })) {
    errors.location = "Location must be at least 5 characters long.";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

exports.validateComment = (data) => {
  const { name, description } = data;

  const errors = {};

  if (!name || !validator.isLength(name, { min: 5 })) {
    errors.name = "Name must be at least 5 characters long.";
  }

  if (!description || !validator.isLength(description, { min: 5 })) {
    errors.description = "Description must be at least 5 characters long.";
  }
  
  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};