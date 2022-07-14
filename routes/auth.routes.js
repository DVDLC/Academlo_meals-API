// Libraries
const { Router } = require("express");
const { check } = require("express-validator");
// Controllers
const { signup, login } = require("../controllers/auth.controllers");
const { emailExists } = require("../middlewares/auth.middlewares");
// Middlewares
const { validateConfig } = require("../middlewares/validators.middlewares");


const router = Router()

// signup
router.post( '/signup', [
    check( 'email', 'invalid email').isEmail(),
    check( 'email' ).custom( email => emailExists( email, 'signup' ) ),
    check( 'name', 'name is required' ).not().isEmpty(),
    check( 'password', 'password is required' ).not().isEmpty(),
    validateConfig
], signup )

// login
router.post( '/login', [
    check( 'email', 'invalid email').isEmail(),
    check( 'email' ).custom( email => emailExists( email, 'login' ) ),
    check( 'password', 'password is required' ).not().isEmpty(),
    validateConfig
], login )

module.exports = router