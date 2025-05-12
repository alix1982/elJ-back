const router = require('express').Router();

const noAutorizationRouter = require('./noAutorization');
const authRouter = require('./auth');
const userRouter = require('./users');
const messageRouter = require('./message');
const ridingRouter = require('./riding');
const departureRouter = require('./departure');
const groupRouter = require('./group');

// const authAdmin = require('../middlewares/authAdmin');
// const users = require('./users');
// const questionnaireRouterAdmin = require('./questionnaireAdmin');
// const programmRouterAdmin = require('./programm');

const errorRouter = require('./errors');
const auth = require('../middlewares/auth');
const cors = require('../middlewares/cors');

router.use(cors);

// router.use(noAutorizationRouter);
router.use(authRouter);
router.use(auth);
router.use(messageRouter);
router.use(userRouter);
// router.use(ridingRouter);
router.use(departureRouter);
router.use(groupRouter);

// router.use(questionnaireRouterAdmin);
// router.use(userRouterAdmin);
// router.use(programmRouterAdmin);
// router.use(groupRouterAdmin);

router.use(errorRouter);

module.exports = router;
