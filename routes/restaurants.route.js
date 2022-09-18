const express = require('express');

const restaurantsRoute = express.Router();

const { protectSession } = require('../middlewares/auth.middlewares');

const {
    createRestaurantValidator,
    updateRestaurantValidator,
    reviewValidator,
} = require('../middlewares/validators.middlewares');

const {
    createRestaurant,
    getAllRestaurants,
    getRestaurantsById,
    updateRestaurant,
    deleteRestaurant,
    createReview,
    updateReview,
    deleteReview,
} = require('../controllers/restaurants.controller');

const {
    restaurantExist,
    userIsAdmin,
    reviewExist,
    reviewOwner,
} = require('../middlewares/restaurants.middlewares');

restaurantsRoute.get('/', getAllRestaurants);

restaurantsRoute.get('/:id', restaurantExist, getRestaurantsById);

restaurantsRoute.use(protectSession);

restaurantsRoute.post('/', createRestaurantValidator, createRestaurant);

restaurantsRoute.patch(
    '/:id',
    userIsAdmin,
    restaurantExist,
    updateRestaurantValidator,
    updateRestaurant
);

restaurantsRoute.delete('/:id', userIsAdmin, restaurantExist, deleteRestaurant);

restaurantsRoute.post('/reviews/:restaurantId', reviewValidator, createReview);

restaurantsRoute.patch(
    '/reviews/:id',
    reviewExist,
    reviewValidator,
    reviewOwner,
    updateReview
);

restaurantsRoute.delete('/reviews/:id', reviewExist, reviewOwner, deleteReview);

module.exports = { restaurantsRoute };
