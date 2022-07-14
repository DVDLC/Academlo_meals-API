// Libraries
const { response } = require("express");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// Models
const { User } = require("../models/user");
// Utils
const { catchAsync } = require("../utils/catchAsync");

// Login & signup
const signup = catchAsync( async( req, res = response, next ) => {

    let { password, ...rest } = req.body
    const salt = bcrypt.genSaltSync(10)
    password = bcrypt.hashSync( password, salt )

    const newUser = await User.build({ password, ...rest })
    await newUser.save()

    newUser.password = undefined

    res.status( 200 ).json({
        newUser
    })
})

// TODO: verificar que la contraseña corresponda con el inout del usuario 

const login = catchAsync( async( req, res = response, next ) => {

    const { email } = req.body

    const userLogin = await User.findOne({ 
        where: { email },
        attributes: [ 'id', 'name', 'email' ]
    })
    const payload = { id: userLogin.id }

    const token = jwt.sign( payload, process.env.JWT_SECRETKEY, { expiresIn: '12h' })

    res.status( 200 ).json({
        userLogin,
        token
    })
})

module.exports = {
    login,
    signup
}