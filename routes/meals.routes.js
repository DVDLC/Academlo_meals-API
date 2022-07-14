// Libraries
const { Router } = require("express");
const { check } = require("express-validator");
// Controllers
const { getAllActiveMeals, 
    getMeal, 
    createMeal, 
    updateMeal, 
    deleteMeal } = require("../controllers/meals.controllers");
// Middlewares
const { protectSession, verifyIfUserisAdmin } = require("../middlewares/jwt.middlewares");
const { validateConfig } = require("../middlewares/validators.middlewares");

const routes = Router()

routes.get( '/', getAllActiveMeals )

routes.get( '/:id', getMeal )

routes.use( [ protectSession, verifyIfUserisAdmin] )

routes.route( '/:id' )
    .post( [
        check( 'name', 'name is required').not().isEmpty(),
        check( 'price', 'price is required' ).not().isEmpty(),
        check( 'category', 'category is required' ).not().isEmpty(),
        validateConfig
    ], createMeal )
    // TODO: Solo puede ser modificado por el ADMIN
    .patch( updateMeal )
    .delete( deleteMeal )

module.exports = routes