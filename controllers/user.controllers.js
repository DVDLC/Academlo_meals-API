// Libraries
const { response } = require("express");
// Models
const { Review } = require("../models/reviews");
const { User } = require("../models/user");
const { Order } = require("../models/orders");
// Utils
const { catchAsync } = require("../utils/catchAsync");


const getAllUsers = catchAsync( async( req, res = response, next ) => {
    const query = { status: 'active' }
    const [ total, users ] = await Promise.all([
        User.count({ where: query }),
        User.findAll({ 
            where: query, 
            attributes: [ 'id', 'name', 'email' ],      
            include: [{
                model: Order,
                attributes: [ 'id', 'mealId', 'quantity', 'totalPrice', 'status' ] 
            },{ 
                model: Review, 
                attributes: [ 'id', 'userId', 'restaurantId', 'comment', 'raiting' ] 
            }]  
        })
    ])
    res.status( 200 ).json({
        total,
        users
     })

})

const updateUser = catchAsync( async( req, res = response, next ) => {

    const { name, email } = req.body
    const { id } = req.params

    const userToUpdate = await User.findOne({ 
        where: { id },
        attributes: [ 'id', 'name', 'email' ] 
    })

    if( name.length > 0 ){
        await userToUpdate.update({ name })
    }if( email.length > 0 ){
        await userToUpdate.update({ email })
    }

    res.status( 200 ).json({
       userToUpdate
    })
})

const deleteUser = catchAsync( async( req, res = response, next ) => {

    const { id } = req.params
    const userDelete = await User.findOne({ where: { id } })
    userDelete.update({ status: 'inactive' })

    res.status( 200 ).json({
        userDelete
    })
})


module.exports = {
    getAllUsers,
    updateUser,
    deleteUser
}