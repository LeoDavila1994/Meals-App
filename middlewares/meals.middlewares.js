const { Meals } = require('../models/meals.models');
const { Restaurants } = require('../models/restaurants.models');
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const mealExist = catchAsync (async (req, res, next) => {

        const { id } = req.params;

        const meal = await Meals.findOne({
            where: { id, status: 'active' },
            include: Restaurants,
        });

        if (!meal) {
            return next(new AppError(`The meal with ID: ${id} doesent, exist or your status is inactive`, 404));
        }

        req.meal = meal;

        next();
});

module.exports = { mealExist };
