const { Users } = require('../models/users.models');
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const userExist = catchAsync (async (req, res, next) => {

        const { id } = req.params;

        const user = await Users.findOne({
            attributes: { exclude: ['password'] },
            where: { id, status: 'active' },
        });

        if (!user) {
            return next(new AppError(`User with ID:${id} doesent exist or your status are inactive`, 404))
        }

        req.user = user;

        next();
});

module.exports = { userExist };
