// Libraries
const { Router } = require("express");
// Controllers
const { 
    updateUser,
    deleteUser, 
    getAllUsers} = require("../controllers/user.controllers");
const { userExists } = require("../middlewares/auth.middlewares");
// Middlewares
const { protectSession,
    verifyIfUserisAdmin, 
    protectUserAccount } = require("../middlewares/jwt.middlewares");

const router = Router()


router.use( protectSession )

router.get( '/', [
    verifyIfUserisAdmin
], getAllUsers )


// update, delete

router.route( '/:id' )
    .patch( 
        [ userExists, protectUserAccount ], 
        updateUser 
    )
    .delete( 
        [ userExists, protectUserAccount ],
        deleteUser 
        )


module.exports = router