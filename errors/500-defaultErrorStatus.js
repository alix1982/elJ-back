class DefaultErrorStatus_500 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}
module.exports = DefaultErrorStatus_500;
