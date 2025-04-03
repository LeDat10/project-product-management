const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/product.controller");

router.get('/',controller.index);

router.get('/products-category/:slugCategory', controller.category);

router.get('/detail/:slugProduct',controller.detail);

router.get('/featured', controller.featured);

router.get("/listNewProducts", controller.listNewProducts);

module.exports = router;