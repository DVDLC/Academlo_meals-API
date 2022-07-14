// Libraries
const { response } = require("express");
// utils
const { catchAsync } = require("../utils/catchAsync");
// Models
const { Meal } = require("../models/meals");
const { Restaurant } = require("../models/restaurant");

const getAllActiveMeals = catchAsync( async( req, res = response, next ) => {
    
    const query = { status: 'active' }
    const [ total, meals ] = await Promise.all([
        Meal.count({ where: query }),
        Meal.findAll({ 
            where: query, 
            attributes: [ 'id', 'name', 'price', 'restaurantId' ] 
        })
    ])
    res.status( 200 ).json({
        total,
        meals
     })
})

const getMeal = catchAsync( async( req, res = response, next ) => {

    const { id } = req.params
    const meal = await Meal.findOne({ 
        where: { id, status: 'active' },
        attributes: [ 'id', 'name', 'price', 'category' ],
        include: [{
            model: Restaurant,
            attributes: [ 'id', 'name' ]
        }]
    })

    res.status( 200 ).json({
        meal
    })
})

// TODO: Verifiacar que el restaurante existe

const createMeal = catchAsync( async( req, res = response, next ) => {

    // RestaurantId
    const { id } = req.params
    const { ...props } = req.body

    const newMeal = await Meal.build({ ...props, restaurantId: id })
    newMeal.save()

    res.status( 200 ).json({
        newMeal
    })
})

const updateMeal = catchAsync( async( req, res = response, next ) => {

    const { id } = req.params
    const { name, price } = req.body
    const mealToUpdate = await Meal.findOne({ where: { id } })
    
    if( name.length > 0 ){
        await mealToUpdate.update({ name })
    }if( price.length > 0 ){
        await mealToUpdate.update({ price })
    }

    res.status( 200 ).json({
        mealToUpdate
    })
})

const deleteMeal = catchAsync( async( req, res = response, next ) => {

    const { id } = req.params
    const mealToDelete = await Meal.findOne({ where: { id } })
    mealToDelete.update({ status: 'inactive' })

    res.status( 200 ).json({
        mealToDelete
    })
})

module.exports = {
    getAllActiveMeals,
    getMeal,
    createMeal,
    updateMeal,
    deleteMeal
}