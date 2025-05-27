const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controllers/client/user.controller");

const authenMiddeware = require("../../middlewares/client/authenticateToken.middleware");

const uploadToCloudHelper = require("../../helper/uploadToCloudinary");

router.post("/register", controller.register);

router.post("/register/confirm", controller.confirmOTP);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgot);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

router.get("/info", authenMiddeware.authenticateToken, controller.getInfoUser);

router.post("/logout", controller.logout);

router.post("/edit", authenMiddeware.authenticateToken, upload.single("avatar"), uploadToCloudHelper.uploadToCloud, controller.edit);

module.exports = router;