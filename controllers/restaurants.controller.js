const { Restaurants } = require('../models/restaurants.models');
const { Reviews } = require('../models/reviews.models');

const createRestaurant = async (req, res) => {
    try {
        const { name, address, rating } = req.body;

        const restaurant = await Restaurants.create({ name, address, rating });

        res.status(200).json({
            status: 'success',
            data: {
                restaurant,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurants.findAll({
            where: { status: 'active' },
            include: Reviews,
        });

        res.status(200).json({
            status: 'succes',
            data: {
                restaurants,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const getRestaurantsById = (req, res) => {
    try {
        const { restaurant } = req;

        res.status(200).json({
            status: 'success',
            data: {
                restaurant,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const updateRestaurant = (req, res) => {
    try {
        const { name, address } = req.body;
        const { restaurant } = req;
        restaurant.update({ name, address });

        res.status(200).json({
            status: 'success',
            data: {
                restaurant,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const deleteRestaurant = (req, res) => {
    try {
        const { restaurant } = req;

        restaurant.update({ status: 'inactive' });

        res.status(204).json({ status: 'succes' });
    } catch (error) {
        console.log(error);
    }
};

const createReview = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
    }
};

const updateReview = (req, res) => {
    try {
        const { comment, rating } = req.body;
        const { review } = req;

        review.update({ comment, rating });

        res.status(200).json({
            status: 'success',
            data: {
                review,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const deleteReview = (req, res) => {
    try {
        const { review } = req;

        review.update({ status: 'deleted' });

        res.status(204).json({ status: 'success' });

        console.log(review);
    } catch (error) {
        console.log(error);
    }
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
