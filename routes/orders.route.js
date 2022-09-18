const express = require('express');

const ordersRoute = express.Router();

const { protectSession } = require('../middlewares/auth.middlewares');

const { orderValidator } = require('../middlewares/validators.middlewares');

const { mealExist, orderExist } = require('../middlewares/orders.middlewares');

const {
    createOrder,
    getAllOrders,
    completedOrder,
    cancellOrder,
} = require('../controllers/orders.controller');

ordersRoute.use(protectSession);

ordersRoute.post('/', orderValidator, mealExist, createOrder);

ordersRoute.get('/me', getAllOrders);

ordersRoute.patch('/:id', orderExist, completedOrder);

ordersRoute.delete('/:id', orderExist, cancellOrder);

module.exports = { ordersRoute };
