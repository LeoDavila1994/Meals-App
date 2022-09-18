const express = require('express');

const usersRoute = express.Router();

const {
    createUserValidator,
    loginValidator,
    updateUserValidator,
} = require('../middlewares/validators.middlewares');

const {
    createUser,
    login,
    updateUser,
    deleteUser,
    getAllUserOrders,
    getOrderDetail,
} = require('../controllers/users.controller');

const { userExist } = require('../middlewares/users.middlewares');

const {
    protectSession,
    protectUsersAccount,
} = require('../middlewares/auth.middlewares');

usersRoute.post('/', createUserValidator, createUser);

usersRoute.post('/login', loginValidator, login);

usersRoute.use(protectSession);

usersRoute.patch(
    '/:id',
    updateUserValidator,
    userExist,
    protectUsersAccount,
    updateUser
);

usersRoute.delete('/:id', userExist, protectUsersAccount, deleteUser);

usersRoute.get('/orders', getAllUserOrders);

usersRoute.get('/orders/:id', getOrderDetail);

module.exports = { usersRoute };
