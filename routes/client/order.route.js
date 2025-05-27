const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/order.controller");


router.get("/", controller.index);

router.post('/confirm',  controller.order);

router.get('/detail/:orderId', controller.orderInfo);

router.get("/payment-data/:orderId", controller.paymentData);

router.post("/payment", controller.payment);
module.exports = router;