// Libraries
const { Router } = require("express");
const { check } = require("express-validator");
// Controllers
const { getAllActiveRestaurants,
    getRestaurant, 
    createRestaurant, 
    updateRestaurantInfo, 
    deleteRestaurant 
} = require("../controllers/restaurant.controller");
const { createReview, 
    updateReview, 
    deleteReview 
} = require("../controllers/review.controllers");
const { userExists } = require("../middlewares/auth.middlewares");
// Middlewares
const { protectSession, verifyIfUserisAdmin } = require("../middlewares/jwt.middlewares");
const { restaurantExists, restaurantExistsByID } = require("../middlewares/restaurants.middlewares");
const { reviewExist, userAlreadyMadeReview } = require("../middlewares/reviews.middlewares");
const { validateConfig } = require("../middlewares/validators.middlewares");

const router = Router()

router.get('/', getAllActiveRestaurants)

router.get('/:id', getRestaurant)


router.use( protectSession )

// Reviews routes
router.post('/reviews/:id', [
    restaurantExistsByID,
    userAlreadyMadeReview
], createReview)

// TODO: Solo el autor de la reseña puede actualizarlo
router.patch('/reviews/:id', [ reviewExist ], updateReview)

router.delete('/reviews/:id', [ reviewExist ], deleteReview)


// Restaurant routes
router.use( verifyIfUserisAdmin )

router.post('/', [
    check( 'name' ).custom( restaurantExists ),
    validateConfig
], createRestaurant)


router.route('/:id')
    .patch( restaurantExistsByID, updateRestaurantInfo )
    .delete( restaurantExistsByID, deleteRestaurant )


module.exports = router