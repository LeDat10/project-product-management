const express = require("express");
const multer = require("multer");
const upload = multer();

const router = express.Router();

const controller = require("../../controllers/admin/product-category.controller");

const uploadToCloudHelper = require("../../helper/uploadToCloudinary");

router.get("/", controller.index);

router.post("/create", upload.single("thumbnail"), uploadToCloudHelper.uploadToCloud, controller.create);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.get("/detail/:id", controller.detail);

router.patch("/edit/:id", upload.single("thumbnail"), uploadToCloudHelper.uploadToCloud, controller.edit);

router.delete("/delete/:id", controller.delete);

router.get("/trash", controller.trash);

router.patch("/trash/restore", controller.restore);

router.delete("/trash/delete/:categoryId", controller.deletePermanently);

router.patch("/trash/restore-multi", controller.restoreMulti);
module.exports = router;