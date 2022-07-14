// Libraries
const { response } = require("express");
// Models
const { Restaurant } = require("../models/restaurant");
const { Review } = require("../models/reviews");
const { Meal } = require("../models/meals");
// Utils
const { catchAsync } = require("../utils/catchAsync");
const { dinamicRate } = require("../utils/controller.utils");
const { AppError } = require("../utils/AppError");

const getAllActiveRestaurants = catchAsync( async( req, res = response, next ) => {

    const { limit, offset } = req.query
    const query = { status: 'active' }
    const [ total, restaurants ] = await Promise.all([
        Restaurant.count({ where: query }),
        Restaurant.findAll({ 
            where: query,
            attributes: [ 'id', 'name', 'address' ],
            limit,
            offset,
            include: [{ 
                model: Meal,
                attributes: [ 'id', 'name', 'price' ] 
            }]
        })
    ])

    res.status( 200 ).json({
        total,
        restaurants
    })
})

const getRestaurant = catchAsync( async( req, res = response, next ) => {
    
    let total
    const { id } = req.params

    const restaurant = await Restaurant.findOne({ 
        where: { id, status: 'active' },
        attributes: [ 'id', 'name', 'address', 'rating', 'totalReviews'],
        include: [{
            model: Meal,
            attributes: [ 'id', 'name', 'price', 'category' ]
        },{
            model: Review,
            attributes: ['id', 'userId', 'restaurantId', 'comment', 'raiting']
        }] 
    })

    if( !restaurant ) return next( new AppError( 404, `Bad request, sorry :c` ) )

    if( restaurant.reviews.length > 0 ){
        total = dinamicRate( restaurant.reviews )
        restaurant.update({ 
            rating: Math.round( total/restaurant.totalReviews  ) 
        })
    }

    res.status( 200 ).json({
        restaurant
    })
})


const createRestaurant = catchAsync( async( req, res = response, next ) => {

    const { ...props } = req.body

    const newRestaurant = await Restaurant.build({ ...props })
    newRestaurant.save()

    res.status( 200 ).json({
        newRestaurant
    })
})


const updateRestaurantInfo = catchAsync( async( req, res = response, next ) => {

    const { name, address } = req.body
    const { id } = req.params
    const restaurant = await Restaurant.findOne({ 
        where: { id },
        attributes: [ 'id', 'name', 'address', 'rating' ]
    })

    if( name.length > 0 ){
        restaurant.update({ name })
    }if( address.length > 0 ){
        restaurant.update({ address })
    }

    res.status( 200 ).json({
        restaurant
    })
})

const deleteRestaurant = catchAsync( async( req, res = response, next ) => {

    const { id } = req.params
    const restaurantToDelete = await Restaurant.findOne({ 
        where: { id },
        attributes: [ 'id', 'name', 'address', 'rating' ]
    })

    restaurantToDelete.update({ status: 'disabled' })
    res.status( 200 ).json({
        restaurantToDelete
    })
})


module.exports = {
    getAllActiveRestaurants,
    getRestaurant,
    createRestaurant,
    updateRestaurantInfo,
    deleteRestaurant
}