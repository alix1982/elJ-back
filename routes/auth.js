const router = require('express').Router();
const { login, createPasswordAdmin, createUser } = require('../controllers/auth');
const { validationRouterLogin } = require('../validations/validationRouter');

router.post('/signin', login);

router.post('/createUser', createUser);
// router.post('/createPassword', createPasswordAdmin);

module.exports = router;
