const { Users } = require('../models/users.models');
const { catchAsync } = require("../utils/catchAsync.util");

const userExist = catchAsync (async (req, res, next) => {

        const { id } = req.params;

        const user = await Users.findOne({
            attributes: { exclude: ['password'] },
            where: { id, status: 'active' },
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: `User with ID:${id} doesent exist or your status are inactive`,
            });
        }

        req.user = user;

        next();
});

module.exports = { userExist };
