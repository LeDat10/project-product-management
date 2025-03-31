const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/order.controller");

router.post('/', controller.order);

module.exports = router;