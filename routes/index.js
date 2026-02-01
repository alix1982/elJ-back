const router = require('express').Router();

const authRouter = require('./auth');
const userRouter = require('./users');
const messageRouter = require('./message');
const departureRouter = require('./departure');
const groupRouter = require('./group');
const applicantRouter = require('./applicant');
const victimRouter = require('./victim');
const eventRouter = require('./event')

// const authAdmin = require('../middlewares/authAdmin');
// const users = require('./users');
// const questionnaireRouterAdmin = require('./questionnaireAdmin');
// const programmRouterAdmin = require('./programm');

const errorRouter = require('./errors');
const auth = require('../middlewares/auth');
const cors = require('../middlewares/cors');

router.use(cors);

router.use(authRouter);
router.use(auth);
router.use(messageRouter);
router.use(userRouter);
router.use(departureRouter);
router.use(groupRouter);
router.use(applicantRouter);
router.use(victimRouter);
router.use(eventRouter);
// router.use(userRouterAdmin);
// router.use(programmRouterAdmin);
// router.use(groupRouterAdmin);

router.use(errorRouter);

module.exports = router;
