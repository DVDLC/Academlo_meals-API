// Libraries
const { response } = require("express");
const jwt = require('jsonwebtoken');
// Models
const { User } = require("../models/user");
// Utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/AppError");

const protectSession = catchAsync( async( req, res= response, next ) => {

    const { authorization } = req.headers
    let token;

    // Verify if token is valid and active
    if( authorization && authorization.startsWith( 'Bearer' ) ){
        token = authorization.split( " " )[1]    
    }

    if( !token ){
        return next( new AppError( 403, 'Invalid token :D' )) 
    }

    const { id } = jwt.verify( token, process.env.JWT_SECRETKEY )
    const userVerified = await User.findOne({ where: { id, status: 'active' } })

    if( !userVerified ){
        return next( new AppError( 403, 'this accouunt is not valid' )) 
    }

    req.sessionUser = userVerified
    next()
})

const verifyIfUserisAdmin = ( req, res, next ) => {
    const { sessionUser } = req
    
    if( sessionUser.role !== 'admin' ){
        return next( new AppError( 403, 'You are not available to do this' ) )
    }
    next()
}

const protectUserAccount =  async( req, res, next ) => {

    // Get user session ID
    const { sessionUser, user } = req
    if( sessionUser.id !== user.id ) return next( new AppError( 403, 'You do not the owner of this account' ) )

    next()
}

module.exports = {
    protectSession,
    verifyIfUserisAdmin,
    protectUserAccount
}