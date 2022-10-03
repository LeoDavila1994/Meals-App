const { Users } = require('../models/users.models');
const { Orders } = require('../models/orders.models');
const { Meals } = require('../models/meals.models');
const { Restaurants } = require('../models/restaurants.models');
const { AppError } = require("../utils/appError.util");

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const { catchAsync } = require("../utils/catchAsync.util");

const createUser = catchAsync (async (req, res, next) => {

        const { name, email, password } = req.body;

        const salt = await bcrypt.genSalt(12);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await Users.create({
            name,
            email,
            password: hashedPassword,
        });

        newUser.password = undefined;

        res.status(201).json({
            status: 'success',
            data: { newUser },
        });
});

const login = catchAsync (async (req, res, next) => {

        const { email, password } = req.body;

        const user = await Users.findOne({
            where: { email, status: 'active' },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new AppError("wrong credentials", 400))
        }

        user.password = undefined;

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(200).json({
            status: 'success',
            data: { user, token },
        });
});

const updateUser = catchAsync (async (req, res, next) => {

        const { name, email } = req.body;
        const { user } = req;

        await user.update({ name, email });

        res.status(200).json({
            status: 'success',
            data: { user },
        });
});

const deleteUser = catchAsync (async (req, res, next) => {

        const { user } = req;

        await user.update({ status: 'inactive' });

        res.status(204).json({ status: 'success' });
});

const getAllUserOrders = catchAsync (async (req, res, next) => {

        const { sessionUser } = req;

        const orders = await Orders.findAll({
            where: { userId: sessionUser.id },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: {
                model: Meals,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Restaurants,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
            },
        });

        res.status(200).json({
            status: 'success',
            data: {
                orders,
            },
        });
});

const getOrderDetail = catchAsync (async (req, res, next) => {

        const { sessionUser } = req;
        const { id } = req.params;

        const order = await Orders.findOne({
            where: { id, userId: sessionUser.id },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: {
                model: Meals,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Restaurants,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
            },
        });

        res.status(200).json({
            status: 'succes',
            data: {
                order,
            },
        });
});

module.exports = {
    createUser,
    login,
    updateUser,
    deleteUser,
    getAllUserOrders,
    getOrderDetail,
};
