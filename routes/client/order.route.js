const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/order.controller");

router.post('/confirm',  controller.order);

router.get('/detail/:orderId', controller.orderInfo);

module.exports = router;