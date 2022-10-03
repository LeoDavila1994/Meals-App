const { Restaurants } = require('../models/restaurants.models');
const { Reviews } = require('../models/reviews.models');

const { catchAsync } = require("../utils/catchAsync.util");

const createRestaurant = catchAsync (async (req, res, next) => {

        const { name, address, rating } = req.body;

        const restaurant = await Restaurants.create({ name, address, rating });

        res.status(200).json({
            status: 'success',
            data: {
                restaurant,
            },
        });
});

const getAllRestaurants = catchAsync (async (req, res, next) => {

        const restaurants = await Restaurants.findAll({
            where: { status: 'active' },
            include: { model: Reviews, where: { status: "active" }, required: false},
        });

        res.status(200).json({
            status: 'succes',
            data: {
                restaurants,
            },
        });
});

const getRestaurantsById = (req, res) => {

        const { restaurant } = req;

        res.status(200).json({
            status: 'success',
            data: {
                restaurant,
            },
        });
};

const updateRestaurant = (req, res) => {

        const { name, address } = req.body;
        const { restaurant } = req;
        restaurant.update({ name, address });

        res.status(200).json({
            status: 'success',
            data: {
                restaurant,
            },
        });
};

const deleteRestaurant = (req, res) => {

        const { restaurant } = req;

        restaurant.update({ status: 'inactive' });

        res.status(204).json({ status: 'succes' });
};

const createReview = catchAsync (async (req, res, next) => {

        const { restaurantId } = req.params;
        const { comment, rating } = req.body;
        const { sessionUser } = req;

        const validId = Number(restaurantId);

        const review = await Reviews.create({
            userId: sessionUser.id,
            comment,
            restaurantId: validId,
            rating,
        });

        res.status(200).json({
            status: 'success',
            data: {
                review,
            },
        });
});

const updateReview = (req, res) => {

        const { comment, rating } = req.body;
        const { review } = req;

        review.update({ comment, rating });

        res.status(200).json({
            status: 'success',
            data: {
                review,
            },
        });
};

const deleteReview = (req, res) => {

        const { review } = req;

        review.update({ status: 'deleted' });

        res.status(204).json({ status: 'success' });
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantsById,
    updateRestaurant,
    deleteRestaurant,
    createReview,
    updateReview,
    deleteReview,
};
