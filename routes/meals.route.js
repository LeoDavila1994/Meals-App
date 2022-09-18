const express = require('express');

const mealsRoute = express.Router();

const { protectSession } = require('../middlewares/auth.middlewares');

const { userIsAdmin } = require('../middlewares/restaurants.middlewares');

const { restaurantExist } = require('../middlewares/restaurants.middlewares');

const { mealValidator } = require('../middlewares/validators.middlewares');

const {
    createMeal,
    getAllMeals,
    getMealById,
    updateMeal,
    deleteMeal,
} = require('../controllers/meals.controller');

const { mealExist } = require('../middlewares/meals.middlewares');

mealsRoute.get('/', getAllMeals);

mealsRoute.get('/:id', mealExist, getMealById);

mealsRoute.use(protectSession);

mealsRoute.post('/:id', restaurantExist, mealValidator, createMeal);

mealsRoute.patch('/:id', userIsAdmin, mealValidator, mealExist, updateMeal);

mealsRoute.delete('/:id', userIsAdmin, mealExist, deleteMeal);

module.exports = { mealsRoute };
