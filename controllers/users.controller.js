const { Users } = require('../models/users.models');
const { Orders } = require('../models/orders.models');
const { Meals } = require('../models/meals.models');
const { Restaurants } = require('../models/restaurants.models');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const createUser = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({
            where: { email, status: 'active' },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(404).json({
                status: 'error',
                message: 'Invalid credentials',
            });
        }

        user.password = undefined;

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(200).json({
            status: 'success',
            data: { user, token },
        });
    } catch (error) {
        console.log(error);
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const { user } = req;

        await user.update({ name, email });

        res.status(200).json({
            status: 'success',
            data: { user },
        });
    } catch (error) {
        console.log(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const { user } = req;

        await user.update({ status: 'inactive' });

        res.status(204).json({ status: 'success' });
    } catch (error) {
        console.log(error);
    }
};

const getAllUserOrders = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
    }
};

const getOrderDetail = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    createUser,
    login,
    updateUser,
    deleteUser,
    getAllUserOrders,
    getOrderDetail,
};
