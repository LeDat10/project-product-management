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

router.get("/trash", authMiddleware.requireAuth, controller.trash);

router.patch("/trash/restore", authMiddleware.requireAuth, controller.restore);

router.delete("/trash/delete/:accountId", authMiddleware.requireAuth, controller.deletePermanently);

router.patch("/trash/restore-multi", authMiddleware.requireAuth, controller.restoreMulti);

router.get("/get-roles", authMiddleware.requireAuth, controller.getRoles);

module.exports = router;