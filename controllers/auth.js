const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NoAuthErr_401 = require('../errors/401-noAuthErr');
const { mesErrLogin401, mesErrLoginSnils401, mesLoginAdmin, mesLoginUser, mesErrValidationUser400, mesErrConflictUser409 } = require('../utils/messageServer');
const IncorrectData_400 = require('../errors/400-incorrectData');
const ConflictData_409 = require('../errors/409-conflictData');
const { NODE_ENV, JWT_SECRET_USER, JWT_SECRET_ADMIN, NAME_ADMIN, PASSWORD_ADMIN } = process.env;

// module.exports.login = (req, res, next) => {
//   const { name, password } = req.body;
//   console.log(req.body)
//   User.findOne({ name })
//     .then((user) => {
//       console.log(user);
//       if (user === null) {
//         throw new NoAuthErr_401(mesErrLoginSnils401);
//       }
//       if (name === user.name && password === user.password) {
//         const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
//           expiresIn: '1d',
//         });
//         return res.send({ token, message: mesLoginUser });
//       } else {
//         throw new NoAuthErr_401(mesErrLogin401);
//       }
//     })
//     .catch(next);
// };


module.exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create({
          name: req.body.name,
          userName: req.body.userName,
          password: hash,
        }))
        .then((user) => {
            const userRes = {
                name: user.name,
                userName: user.userName,
                message: "Пользователь создан!"
              };
              res.send(userRes);
            })
            .catch((err) => {
                console.log(err);
                if (err.name === 'ValidationError') {
                    next(new IncorrectData_400(mesErrValidationUser400));
                    return;
                  }
                  if (err.code === 11000) {
                      next(new ConflictData_409(mesErrConflictUser409));
                      return;
                    }
                    next(err);
                  });
              };

module.exports.createPasswordAdmin = (req, res, next) => {
  console.log('нужен пароль');
  res.send('нужен пароль');
};

module.exports.login = (req, res, next) => {
  const { name, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  User.findOne({ name }).select('+password')
    .then((user) => {
      if (user === null) {
        throw new NoAuthErr_401(mesErrLogin401);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NoAuthErr_401(mesErrLogin401);
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET_USER : 'some-secret-key',
            { expiresIn: '1d' },
          );

          // const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.send({ token, message: mesLoginUser, userName: user.userName });
        });
    })
    .catch(next);
};
