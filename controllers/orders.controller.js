const { Orders } = require('../models/orders.models');
const { Restaurants } = require('../models/restaurants.models');
const { Meals } = require('../models/meals.models');

const createOrder = async (req, res) => {
    try {
        const { meal, sessionUser } = req;

        const activeOrder = await Orders.findAll({
            where: { userId: sessionUser.id, status: 'active' },
        });

        if (activeOrder[0]) {
            return res.status(404).json({
                status: 'error',
                message: 'The user has an order in process',
            });
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
    } catch (error) {
        console.log();
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.findAll({
            include: { model: Meals, include: Restaurants },
        });

        res.status(200).json({
            status: 'success',
            data: {
                orders,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const completedOrder = (req, res) => {
    try {
        const { order } = req;

        order.update({ status: 'completed' });

        res.status(200).json({
            status: 'success',
            data: {
                order,
            },
        });
    } catch (error) {
        console.log();
    }
};

const cancellOrder = (req, res) => {
    try {
        const { order } = req;

        order.update({ status: 'cancelled' });

        res.status(204).json({ status: 'success' });
    } catch (error) {
        console.log();
    }
};

module.exports = { createOrder, getAllOrders, completedOrder, cancellOrder };
