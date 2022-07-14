const { Meal } = require("../models/meals")
const { Order } = require("../models/orders")
const { Restaurant } = require("../models/restaurant")
const { Review } = require("../models/reviews")
const { User } = require("../models/user")

const dbRelations = () => {

    // User relations
    User.hasMany( Review, { foreignKey: 'id' } )
    Review.belongsTo( User, { foreignKey: 'userId' } )

    User.hasMany( Order, { foreignKey: 'id' } )
    Order.belongsTo( User, { foreignKey: 'userId' } )

    // Restaurants relations
    Restaurant.hasMany( Review )
    Review.belongsTo( Restaurant )

    Restaurant.hasMany( Meal, { foreignKey: 'restaurantId' } )
    Meal.belongsTo( Restaurant, { foreignKey: 'id' } )

    // Order Relations 
    Order.hasOne( Meal, { foreignKey: 'id' } )
    Meal.belongsTo( Order, { foreignKey: 'id' } )
}

module.exports = { dbRelations }