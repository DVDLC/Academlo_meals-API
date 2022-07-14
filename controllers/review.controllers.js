// Libraries
const { response } = require("express");
const { Restaurant } = require("../models/restaurant");
// Models
const { Review } = require("../models/reviews");
// Utils
const { catchAsync } = require("../utils/catchAsync");


const createReview = catchAsync( async( req, res = response, next ) => {

    const { id } = req.params
    const { comment, raiting } = req.body
    const { sessionUser } = req

    const [ review, restaurant ] = await Promise.all([
        Review.build({ 
            userId: sessionUser.id, 
            restaurantId: Number( id ), 
            comment,
            raiting
        }),
        Restaurant.findOne({ where: { id } })
    ])

    const { totalReviews } = restaurant

    restaurant.update({ totalReviews: totalReviews + 1 })
    review.save()

    res.status( 200 ).json({
        restaurant
    })
})

const updateReview = catchAsync( async( req, res = response, next ) => {

    const { comment, raiting } = req.body
    const { id } = req.params
    const reviewToUpdate = await Review.findOne({ where: { id, status: 'active' } })

    if( comment.length > 0 ) reviewToUpdate.update({ comment })
    if( raiting.length > 0 || raiting !== undefined ) reviewToUpdate.update({ raiting }) 

    res.status( 200 ).json({
        reviewToUpdate
    })
})

const deleteReview = catchAsync( async( req, res = response, next ) => {

    const { id } = req.params

    const review = await Review.findOne({ where: { id, status: 'active' } })
    const restaurant = await Restaurant.findOne({ where: { id: review.restaurantId } })

    const { totalReviews } = restaurant
    review.update({ status: 'delete' })
    restaurant.update({ totalReviews: totalReviews - 1 })

    res.status( 200 ).json({
        review
    })
})

module.exports ={
    createReview,
    updateReview,
    deleteReview
}