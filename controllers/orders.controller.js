const { Orders } = require('../models/orders.models');
const { Restaurants } = require('../models/restaurants.models');
const { Meals } = require('../models/meals.models');
const { AppError } = require("../utils/appError.util");

const { catchAsync } = require("../utils/catchAsync.util");

const createOrder = catchAsync (async (req, res, next) => {

        const { meal, sessionUser } = req;

        const activeOrder = await Orders.findAll({
            where: { userId: sessionUser.id, status: 'active' },
        });

        if (activeOrder[0]) {
            return next(new AppError('The user has an order in process', 400))
        }

        const { quantity } = req.body;

        const totalPrice = meal.price * quantity;

        const order = await Orders.create({
            mealId: meal.id,
            userId: sessionUser.id,
            totalPrice,
            quantity,
        });

        res.status(200).json({
            status: 'success',
            data: {
                order,
            },
        });
});

const getAllOrders = catchAsync (async (req, res, next) => {

        const orders = await Orders.findAll({
            include: { model: Meals, include: Restaurants },
        });

        res.status(200).json({
            status: 'success',
            data: {
                orders,
            },
        });
});

const completedOrder = (req, res) => {

        const { order } = req;

        order.update({ status: 'completed' });

        res.status(200).json({
            status: 'success',
            data: {
                order,
            },
        });
};

const cancellOrder = (req, res) => {

        const { order } = req;

        order.update({ status: 'cancelled' });

        res.status(204).json({ status: 'success' });
};

module.exports = { createOrder, getAllOrders, completedOrder, cancellOrder };
