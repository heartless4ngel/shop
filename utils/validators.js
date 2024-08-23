const { check, body } = require("express-validator");

const User = require("../models/user.js");

exports.signupValidator = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject(
            "E-Mail exists already, please pick a different one."
          );
        }
      });
    })
    .normalizeEmail(),
  body(
    "password",
    "Please enter a password with only numbers and text and at least 5 characters"
  )
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords have to match!");
    }
    return true;
  }),
];

exports.loginValidator = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),
  body(
    "password",
    "Please enter a password with only numbers and text and at least 5 characters"
  )
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric(),
];

exports.addProductValidator = [
  body("title", "Please enter a valid title.")
    .trim()
    .isString()
    .isLength({ min: 3 }),
  body("price", "Please enter a valid price.").isCurrency(),
  body("description", "Please enter a valid description.")
    .trim()
    .isLength({ min: 5, max: 400 }),
  body(
    "file",
    "Attached file is not an image or you inserted an invalid format"
  ).custom((value, { req }) => {
    if (!req.file) {
      return false;
    }
    return true;
  }),
];

exports.editProductValidator = [
  body("title", "Please enter a valid title.")
    .trim()
    .isString()
    .isLength({ min: 3 }),
  body("price", "Please enter a valid price.").isCurrency(),
  body("description", "Please enter a valid description.")
    .trim()
    .isLength({ min: 5, max: 400 }),
];
