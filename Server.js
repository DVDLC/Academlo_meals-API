
const express = require('express')
const { dbRelations } = require('./db/db-relations')
const { db } = require('./db/db.config')
const { AppError } = require('./utils/AppError')
const { globalErrorHandler } = require('./utils/globalErrorHandler')

class Server{
    constructor(){
        this.PORT = process.env.PORT || 4000
        this.app = express()
        this.paths = {
            user: '/api/v1/users/',
            auth: '/api/v1/auth/',
            restaurants: '/api/v1/restaurants/',
            meals: '/api/v1/meals/',
            orders: '/api/v1/orders/',
            error: '*'
        }

        this.dbConnection()

        this.middlewares()

        this.routes()

        this.notFound()

        this.errorHandler()

    }

    middlewares(){
        this.app.use( express.json() )
    }

    routes(){
        this.app.use( this.paths.auth, require('./routes/auth.routes') )
        this.app.use( this.paths.user, require('./routes/user.routes') )
        this.app.use( this.paths.restaurants, require( './routes/restaurant.routes' ) )
        this.app.use( this.paths.meals, require('./routes/meals.routes') )
        this.app.use( this.paths.orders, require('./routes/orders.routes') )
    }

    notFound(){
        this.app.all( this.paths.error, ( req, res, next ) => {
            next( new AppError(
                404, `${ req.method } ${ req.originalUrl } not found in this server`
            ))
        })
    }

    errorHandler(){
        this.app.use( globalErrorHandler )
    }

    listen(){
        this.app.listen( this.PORT, () => {
            console.log( `Server running at port: ${ this.PORT }` )
        })
    }

    async dbConnection(){
        try{
            await Promise.all([
                db.authenticate(),
                db.sync({ /* force: true */ })
            ])

            // DataBase relations
            dbRelations()

            console.log( 'DB authenticated & sync' )
        }catch(err){
            console.log( 'Error to connect to DB' ) 
        }
    }
}

module.exports = Server