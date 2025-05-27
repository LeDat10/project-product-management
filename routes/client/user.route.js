const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controllers/client/user.controller");
const uploadToCloudHelper = require("../../helper/uploadToCloudinary");
const authorMiddleware = require("../../middlewares/client/author.middlware");
router.post("/register", controller.register);

router.post("/register/confirm", controller.confirmOTP);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgot);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

router.get("/info", authorMiddleware.requireAuth, controller.getInfoUser);

router.post("/logout", controller.logout);

router.post("/edit", authorMiddleware.requireAuth, upload.single("avatar"), uploadToCloudHelper.uploadToCloud, controller.edit);

module.exports = router;