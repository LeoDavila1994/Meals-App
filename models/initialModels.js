const { Users } = require('./users.models');
const { Restaurants } = require('./restaurants.models');
const { Meals } = require('./meals.models');
const { Reviews } = require('./reviews.models');
const { Orders } = require('./orders.models');

const initialModels = () => {
    // 1 <----> M

    Users.hasMany(Orders, { foreignKey: 'userId' });
    Orders.belongsTo(Users);

    Users.hasMany(Reviews, { foreignKey: 'userId' });
    Reviews.belongsTo(Users);

    Restaurants.hasMany(Reviews, { foreignKey: 'restaurantId' });
    Reviews.belongsTo(Restaurants);

    Restaurants.hasMany(Meals, { foreignKey: 'restaurantId' });
    Meals.belongsTo(Restaurants);

    // 1 <----> 1

    Meals.hasOne(Orders, { foreignKey: 'mealId' });
    Orders.belongsTo(Meals);
};

module.exports = { initialModels };
