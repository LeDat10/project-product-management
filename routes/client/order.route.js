const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/order.controller");

const cartMiddleware = require("../../middlewares/client/cart.middleware");

router.post('/confirm', cartMiddleware.cartId, controller.order);

router.get('/info-order/:orderId', controller.orderInfo);

module.exports = router;