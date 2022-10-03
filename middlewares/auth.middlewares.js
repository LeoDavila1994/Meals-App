const { Users } = require('../models/users.models');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const protectSession = catchAsync (async (req, res, next) => {

        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('Invalid session', 403))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Users.findOne({
            where: { id: decoded.id, status: 'active' },
        });

        if (!user) {
            return next('The owner of the session is no longer active', 403);
        }

        req.sessionUser = user;

        next();
});

const protectUsersAccount = (req, res, next) => {
    const { sessionUser, user } = req;

    if (sessionUser.id !== user.id) {
        return next(new AppError('You are not the owner of this account', 403))
    }

    next();
};

module.exports = { protectSession, protectUsersAccount };
