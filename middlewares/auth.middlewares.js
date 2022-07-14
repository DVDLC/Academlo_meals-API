// Models
const { User } = require("../models/user");
// Utils
const { AppError } = require("../utils/AppError");

const emailExists = async( email, verificationType ) => {
    const emailExist = await User.findOne({ where: { email } })

    switch ( verificationType ) {
        case 'signup':
            if( emailExist ) throw new Error( `${ email } is already exist` )
            break
        case 'login':
            if( !emailExist ) throw new Error( `${ email } is not exist` )
            break
        default:
            break;
    }
}

const userExists =  async( req, res, next ) => {
    const { id } = req.params

    const user = await User.findOne({ where: { id, status: 'active' } })
    if( !user ){
        return next( new AppError( 404, 'User not found' ) )
    }

    req.user = user
    next()
}

module.exports = {
    emailExists,
    userExists
}