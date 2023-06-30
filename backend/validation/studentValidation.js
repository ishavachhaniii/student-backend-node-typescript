const validator = require("validator");

exports.validateStudentData = (data) => {
  const {
    firstName,
    lastName,
    standard,
    divison,
    gender,
    email,
    mobileNumber,
    address,
  } = data;

  const errors = {};

  if (!firstName || !validator.isLength(firstName, { min: 5 })) {
    errors.firstName = "First name must be at least 5 characters long.";
  }

  if (!lastName || !validator.isLength(lastName, { min: 5 })) {
    errors.lastName = "Last name must be at least 5 characters long.";
  }

  if (!standard || !validator.isNumeric(standard.toString())) {
    errors.standard = "Standard must be a numeric value.";
  }

  if (validator.isEmpty(divison)) {
    errors.divison = "Divison is required.";
  }

  if (!gender || !["female", "male", "other"].includes(gender)) {
    errors.gender = "Gender must be either 'female' or 'male'.";
  }

  if (!email || !validator.isEmail(email.toString())) {
    errors.email = "Email must have a valid format.";
  }

  if (
    !mobileNumber ||
    !validator.isLength(mobileNumber.toString(), { min: 10, max: 10 }) ||
    !validator.isNumeric(mobileNumber.toString())
  ) {
    errors.mobileNumber = "Mobile number must have exactly 10 digits.";
  }

  if (!address || !validator.isLength(address, { min: 3 })) {
    errors.address = "Address must be at least 3 characters long.";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

exports.validateUpdateStudentData = (data) => {
  const { firstName, lastName, standard, divison, gender, email, mobileNumber, address } = data;

  const errors = {};

  if (!firstName || !validator.isLength(firstName, { min: 5 })) {
    errors.firstName = "First name must be at least 5 characters long.";
  }

  if (!lastName || !validator.isLength(lastName, { min: 5 })) {
    errors.lastName = "Last name must be at least 5 characters long.";
  }

  if (!standard || !validator.isNumeric(standard.toString())) {
    errors.standard = "Standard must be a numeric value.";
  }

  if (validator.isEmpty(divison)) {
    errors.divison = "Divison is required.";
  }

  if (!gender || !["female", "male", "other"].includes(gender)) {
    errors.gender = "Gender must be either 'female' or 'male'.";
  }

  if (!email || !validator.isEmail(email.toString())) {
    errors.email = "Email must have a valid format.";
  }

  if (
    !mobileNumber ||
    !validator.isLength(mobileNumber.toString(), { min: 10, max: 10 }) ||
    !validator.isNumeric(mobileNumber.toString())
  ) {
    errors.mobileNumber = "Mobile number must have exactly 10 digits.";
  }

  if (!address || !validator.isLength(address, { min: 3 })) {
    errors.address = "Address must be at least 3 characters long.";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};
