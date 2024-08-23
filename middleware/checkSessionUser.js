const User = require("../models/user.js");
const CustomError = require("../utils/CustomError.js");
CustomError;

module.exports = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      return next(new CustomError(err.message));
    });
};
