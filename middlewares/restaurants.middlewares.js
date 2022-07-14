// Models
const { Restaurant } = require("../models/restaurant")
// Utils
const { AppError } = require("../utils/AppError")

const restaurantExists = async( name ) => {
    
    const isExist = await Restaurant.findOne({ where: { name } })

    if( isExist ) throw new Error(`${ name } is already exist`)   
}

const restaurantExistsByID = async( req, res, next ) => {
    
    const { id } = req.params
    const isExist = await Restaurant.findOne({ where: { id } })

    if( !isExist ) next( new AppError( 404, 'Bad request, sorry :c' ) ) 
    next() 
}


module.exports = {
    restaurantExists,
    restaurantExistsByID
}