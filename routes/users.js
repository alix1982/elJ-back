const router = require('express').Router();
const { getUserMe, getUsers } = require('../controllers/users');
// const { validationRouterUpdateProgramm } = require('../validations/validationRouter');

router.get('/users/me', getUserMe);

router.get('/users', getUsers);

// router.get('/user/groups', getUserGroup);

// router.patch('/user/updateProgramm/:id', validationRouterUpdateProgramm, patchUserProgramm);

module.exports = router;
