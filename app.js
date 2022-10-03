const express = require('express');

const app = express();

app.use(express.json());

const { usersRoute } = require('./routes/users.route');

const { restaurantsRoute } = require('./routes/restaurants.route');

const { mealsRoute } = require('./routes/meals.route');

const { ordersRoute } = require('./routes/orders.route');

app.use('/api/v1/users', usersRoute);

app.use('/api/v1/restaurants', restaurantsRoute);

app.use('/api/v1/meals', mealsRoute);

app.use('/api/v1/orders', ordersRoute);

app.use((error, req, res, next) => {

    const statusCode = error.statusCode || 500
    const status = error.status || "fail"

    res.status(statusCode).json({
        status,
        message: error.message,
        error,
        stack: error.stack
    });
});

app.all('*', (req, res) => {
    const { method, url } = req;

    res.status(404).json({
        status: 'error',
        message: `${method}/${url} dont exist in our server`,
    });
});

module.exports = { app };
