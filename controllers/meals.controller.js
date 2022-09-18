const { Meals } = require('../models/meals.models');
const { Restaurants } = require('../models/restaurants.models');

const createMeal = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
    }
};

const getAllMeals = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
    }
};

const getMealById = async (req, res) => {
    try {
        const { meal } = req;

        res.status(200).json({
            status: 'success',
            data: {
                meal,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const updateMeal = (req, res) => {
    try {
        const { meal } = req;
        const { name, price } = req.body;

        meal.update({ name, price });

        res.status(200).json({
            status: 'success',
            data: {
                meal,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const deleteMeal = (req, res) => {
    try {
        const { meal } = req;

        meal.update({ status: 'inactive' });

        res.status(204).json({ status: 'success' });
    } catch (error) {
        console.log();
    }
};

module.exports = {
    createMeal,
    getAllMeals,
    getMealById,
    updateMeal,
    deleteMeal,
};
