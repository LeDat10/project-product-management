const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");

const cartMiddleware = require("../../middlewares/client/cart.middleware");


router.post("/register", controller.register);

router.post("/register/confirm", controller.confirmOTP);

router.post("/login", cartMiddleware.cartId, controller.login);

router.post("/password/forgot", controller.forgot);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

module.exports = router;