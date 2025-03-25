const express = require("express");
const multer = require("multer");
const upload = multer();

const router = express.Router();

const controller = require("../../controllers/admin/account.controller");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

const uploadToCloudHelper = require("../../helper/uploadToCloudinary");

router.get("/", controller.index);

router.post("/create", authMiddleware.requireAuth, upload.single("avatar"), uploadToCloudHelper.uploadToCloud, controller.create);

router.patch("/change-status/:id", authMiddleware.requireAuth, controller.changeStatus);

router.delete("/delete/:id", authMiddleware.requireAuth, controller.delete);

router.get("/detail/:id", authMiddleware.requireAuth, controller.detail);

router.patch("/edit/:id", authMiddleware.requireAuth, upload.single("avatar"), uploadToCloudHelper.uploadToCloud, controller.edit);

router.post("/login", controller.login);

router.get("/get-role", authMiddleware.requireAuth, controller.getRole);



module.exports = router;