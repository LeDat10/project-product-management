const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/cart.controller");

router.get('/', controller.index);

router.post("/add/:productId", controller.addProduct);

router.delete('/delete/:productId', controller.delete);

router.patch('/update/:productId', controller.update);

router.patch("/selected", controller.select);

module.exports = router;