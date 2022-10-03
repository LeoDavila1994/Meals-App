const { Meals } = require('../models/meals.models');
const { Orders } = require('../models/orders.models');
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const mealExist = catchAsync (async (req, res, next) => {
        const { mealId } = req.body;

        const meal = await Meals.findOne({
            where: { id: mealId, status: 'active' },
        });

        if (!meal) {
            return next(new AppError(`Meal with ID:${mealId} doesent exist or your status is inactive`, 404))
        }

        req.meal = meal;

        next();
});

const orderExist = catchAsync (async (req, res, next) => {

        const { id } = req.params;

        const order = await Orders.findOne({ where: { id, status: 'active' } });

        if (!order) {
            return next(new AppError(`The order with ID:${id} doesent exist or your status is diferent to active`, 404))
        }

        req.order = order;

        next();
});

module.exports = { mealExist, orderExist };
