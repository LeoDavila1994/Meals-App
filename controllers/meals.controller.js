const { Meals } = require('../models/meals.models');
const { Restaurants } = require('../models/restaurants.models');

const { catchAsync } = require("../utils/catchAsync.util");

const createMeal = catchAsync (async (req, res, next) => {

        const { name, price } = req.body;
        const { restaurant } = req;
        const meal = await Meals.create({
            name,
            price,
            restaurantId: restaurant.id,
        });

        res.status(200).json({
            status: 'success',
            data: {
                meal,
            },
        });
});

const getAllMeals = catchAsync (async (req, res, next) => {

        const meals = await Meals.findAll({
            where: { status: 'active' },
            include: Restaurants,
        });

        res.status(200).json({
            status: 'success',
            data: {
                meals,
            },
        });
});

const getMealById = catchAsync (async (req, res, next) => {

        const { meal } = req;

        res.status(200).json({
            status: 'success',
            data: {
                meal,
            },
        });
});

const updateMeal = (req, res) => {

        const { meal } = req;
        const { name, price } = req.body;

        meal.update({ name, price });

        res.status(200).json({
            status: 'success',
            data: {
                meal,
            },
        });
};

const deleteMeal = (req, res) => {

        const { meal } = req;

        meal.update({ status: 'inactive' });

        res.status(204).json({ status: 'success' });
};

module.exports = {
    createMeal,
    getAllMeals,
    getMealById,
    updateMeal,
    deleteMeal,
};
