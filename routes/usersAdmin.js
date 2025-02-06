const router = require('express').Router();

const {
  validationRouterCreateUserAdmin,
  validationRouterDeleteUserAdmin,
  validationRouterAddGroupUserAdmin,
  validationRouterDeleteGroupUserAdmin,
} = require('../validations/validationRouter');

const { getUsers, createUser, deleteUserAdmin, addGroupUserAdmin, deleteGroupUserAdmin } = require('../controllers/usersAdmin');

router.get('/user/admin/users', getUsers);

router.post('/user/admin/createUser', validationRouterCreateUserAdmin, createUser);

router.patch('/user/admin/addGroup/:_id', validationRouterAddGroupUserAdmin, addGroupUserAdmin);

router.patch('/user/admin/deleteGroup/:_id', validationRouterDeleteGroupUserAdmin, deleteGroupUserAdmin);

router.delete('/user/admin/deleteUser/:_id', validationRouterDeleteUserAdmin, deleteUserAdmin);

module.exports = router;
