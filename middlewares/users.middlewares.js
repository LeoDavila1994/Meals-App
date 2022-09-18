const { Users } = require('../models/users.models');

const userExist = async (req, res, next) => {
    try {
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
    } catch (error) {
        console.log(error);
    }
};

module.exports = { userExist };
