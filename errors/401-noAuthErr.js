class NoAuthErr_401 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
module.exports = NoAuthErr_401;
