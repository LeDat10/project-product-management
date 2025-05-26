const express = require("express");
const multer = require("multer");
const upload = multer();

const router = express.Router();

const controller = require("../../controllers/admin/product.controller");

const uploadToCloudHelper = require("../../helper/uploadToCloudinary");

router.get("/", controller.index);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.delete);

router.post("/create", upload.single("thumbnail"), uploadToCloudHelper.uploadToCloud, controller.create);

router.get("/detail/:id", controller.detail);

router.patch("/edit/:id", upload.single("thumbnail"), uploadToCloudHelper.uploadToCloud, controller.edit);

router.get("/trash", controller.trash);

router.patch("/trash/restore", controller.restore);

router.delete("/trash/delete/:productId", controller.deletePermanently);

router.patch("/trash/restore-multi", controller.restoreMulti);

router.get("/category", controller.getCategory);

module.exports = router;