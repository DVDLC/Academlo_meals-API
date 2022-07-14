const { Router } = require("express");
const { getAllOrders, 
    createOrder, 
    updateOrderStatus, 
    DeleteOrder, 
    getOrderById} = require("../controllers/order.controllers");
const { protectSession } = require("../middlewares/jwt.middlewares");

const router = Router()

router.use( protectSession )

router.get( '/me', getAllOrders )

router.post( '/', createOrder )

router.route( '/:id' )
    .get( getOrderById )
    .patch( updateOrderStatus )
    .delete( DeleteOrder )

module.exports = router