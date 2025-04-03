const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");

// const cartMiddleware = require("../../middlewares/client/cart.middleware");
// const authenMiddeware = require("../../middlewares/client/authenticateToken.middleware");

const authorMiddleware = require("../../middlewares/client/author.middlware");

router.post("/register", controller.register);

router.post("/register/confirm", controller.confirmOTP);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgot);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

router.get("/info", authorMiddleware.requireAuth, controller.getInfoUser);

module.exports = router;