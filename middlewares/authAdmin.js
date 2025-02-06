const jwt = require('jsonwebtoken');
require('dotenv').config();
const NoAuthErr_401 = require('../errors/401-noAuthErr');
const { mesErrAuth401 } = require('../utils/messageServer');

const { NODE_ENV, JWT_SECRET_ADMIN } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NoAuthErr_401(mesErrAuth401);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET_ADMIN);
  } catch (err) {
    next(new NoAuthErr_401(mesErrAuth401));
    return;
  }
  req.user = payload;
  next();
};
