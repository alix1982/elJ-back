class IncorrectData_400 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
module.exports = IncorrectData_400;
