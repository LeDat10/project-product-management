const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/cart.controller");

router.get('/', controller.index);

router.post("/add/:productId", controller.addProduct);

router.delete('/delete/:objectId', controller.delete);

router.patch('/update/:objectId', controller.update);

module.exports = router;