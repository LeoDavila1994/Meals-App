const { Restaurants } = require('../models/restaurants.models');
const { Reviews } = require('../models/reviews.models');
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const restaurantExist = catchAsync (async (req, res, next) => {

        const { id } = req.params;

        const restaurant = await Restaurants.findOne({
            where: { id, status: 'active' },
            include: Reviews,
        });

        if (!restaurant) {
            return next(new AppError(`The restaurant whit ID: ${id} doesent exist in our server or the status is inactive`), 404)
        }

        req.restaurant = restaurant;

        next();
});

const userIsAdmin = (req, res, next) => {

        const { sessionUser } = req;

        if (sessionUser.role !== 'admin') {
            res.status(404).json({
                status: 'error',
                message: 'Just the admin user can update the restaurants',
            });
        }

        next();
};

const reviewExist = catchAsync (async (req, res, next) => {

        const { id } = req.params;
        const validId = Number(id);
        const review = await Reviews.findOne({
            where: { id: validId, status: 'active' },
        });

        if (!review) {
            res.status(404).json({
                status: 'error',
                message: `Review with ID: ${id} doesent exist or your status is inactive`,
            });
        }

        req.review = review;

        next();
});

const reviewOwner = (req, res, next) => {

        const { sessionUser, review } = req;

        if (sessionUser.id !== review.userId) {
            return res.status(404).json({
                status: 'error',
                message: 'You are not the review owner',
            });
        }

        next();
};

module.exports = { restaurantExist, userIsAdmin, reviewExist, reviewOwner };
