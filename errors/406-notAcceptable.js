class NotAcceptable_406 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 406;
  }
}
module.exports = NotAcceptable_406;
