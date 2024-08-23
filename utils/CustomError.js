class CustomError extends Error {
  constructor(message) {
    super(message);
    this.httpStatusCode = 500;
  }
}

module.exports = CustomError;
