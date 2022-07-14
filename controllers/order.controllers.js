// Libraries
const { response } = require("express");
// Models
const { Meal } = require("../models/meals");
const { Order } = require("../models/orders");
const { User } = require("../models/user");
// Utils
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

// User orders
const getAllOrders = catchAsync(async( req, res = response, next ) => {

    const { id } = req.sessionUser
    const [ total, orders ] = await Promise.all([
        Order.count({ where: { userId: id } }),
        Order.findAll({ 
            where: { userId: id },
            attributes: [ 'id', 'mealId', 'userId', 'totalPrice', 'quantity', 'status' ],
            include: [{
                model: Meal,
                attributes: [ 'id', 'name', 'price', 'restaurantId' ] 
            },{
                model: User,
                attributes: [ 'id', 'name', 'email' ]
            }]
        })
    ])

    res.status( 200 ).json({
        total,
        orders
    })
})

const getOrderById = catchAsync( async( req, res = response, next ) => {

    const { id } = req.params
    const { sessionUser } = req

    const order = await Order.findOne({ 
        where: {id, userId: sessionUser.id},
        attributes: [ 'id', 'mealId', 'userId', 'totalPrice', 'quantity' ],
        include: [{
            model: Meal,
            attributes: [ 'id', 'name', 'price', 'restaurantId' ] 
        }] 
    })

    if( !order ) return next( new AppError( 400, 'The order are you looking for doesnt exist' ) )

    res.status( 200 ).json({
        order
    })
})

const createOrder = catchAsync(async( req, res = response, next ) => {

    const { sessionUser } = req
    const { mealId, quantity = 1 } = req.body
    const [ userAlreadyOrder, meal ] = await Promise.all([
        Order.findOne({ 
            where: { mealId, userId: sessionUser.id, status: 'active'  } 
        }),
        Meal.findOne({ where: { id: mealId, status: 'active'} })
    ])

    const { price } = meal
    if( !meal ) return next( new AppError( 404, 'The meal does not exists :c '))
    
    if( userAlreadyOrder !== null ){
        const quantityUpd = userAlreadyOrder.quantity + quantity

        await userAlreadyOrder.update({ 
            quantity: quantityUpd, 
            totalPrice: quantityUpd * price
        })

        return res.status( 200 ).json({ 
            userAlreadyOrder
        })
    }

    const newOrder = await Order.build({ 
        mealId, 
        userId: sessionUser.id, 
        quantity: quantity,
        totalPrice: quantity * price, 
    })
    newOrder.save() 

    res.status( 200 ).json({
        newOrder
    })
})

const updateOrderStatus = catchAsync(async( req, res = response, next ) => {

    const { id } = req.params
    const orderToUpdate = await Order.findOne({ where: { id, status: 'active' }})
    
    if( !orderToUpdate ) return next( new AppError( 400, 'This order does not exists' ) )
    await orderToUpdate.update({ status: 'completed' })

    res.status( 200 ).json({
        orderToUpdate 
    })
})

const DeleteOrder = catchAsync(async( req, res = response, next ) => {
    const { id } = req.params
    const orderToUpdate = await Order.findOne({ where: { id, status: 'active' }})
    
    if( !orderToUpdate ) return next( new AppError( 400, 'This order does not exists' ) )
    await orderToUpdate.update({ status: 'cancelled' })

    res.status( 200 ).json({
        orderToUpdate 
    })
})

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    DeleteOrder
}