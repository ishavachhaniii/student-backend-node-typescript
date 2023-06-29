const validator = require("validator")

exports.validateSignupData = (data) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    mobileNumber,
  } = data;

  const errors = {};

  if (!firstName || !validator.isLength(firstName, { min: 5 })) {
    errors.firstName = "First name must be at least 5 characters long."
  }

  if (!lastName || !validator.isLength(lastName, { min: 5 })) {
    errors.lastName = "Last name must be at least 5 characters long."
  }
  
  if (!email || !validator.isEmail(email.toString())) {
    errors.email = "Email must have a valid format."
  }

  if (!password || !validator.isLength(password, { min: 5 })) {
    errors.password = "Password must be at least 5 characters long."
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Password and confirm password do not match."
  }

  if (
    !mobileNumber ||
    !validator.isLength(mobileNumber.toString(), { min: 10, max: 10 }) ||
    !validator.isNumeric(mobileNumber.toString())
  ) {
    errors.mobileNumber = "Mobile number must have exactly 10 digits."
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

exports.validateSigninData = (data) => {
  const { email, password } = data;

  const errors = {};

  if (!email || !validator.isEmail(email.toString())) {
    errors.email = "Email must have a valid format."
  }

  if (!password || !validator.isLength(password, { min: 5 })) {
    errors.password = "Password must be at least 5 characters long."
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

exports.validateUpdateUser = (data) => {
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
  } = data;

  const errors = {};

  if (!firstName || !validator.isLength(firstName, { min: 5 })) {
    errors.firstName = "First name must be at least 5 characters long."
  }

  if (!lastName || !validator.isLength(lastName, { min: 5 })) {
    errors.lastName = "Last name must be at least 5 characters long."
  }

  if (!email || !validator.isEmail(email.toString())) {
    errors.email = "Email must have a valid format."
  }

  if (
    !mobileNumber ||
    !validator.isLength(mobileNumber.toString(), { min: 10, max: 10 }) ||
    !validator.isNumeric(mobileNumber.toString())
  ) {
    errors.mobileNumber = "Mobile number must have exactly 10 digits."
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};