module.exports = class ConflictData_409 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
// module.exports = ConflictData_409;
