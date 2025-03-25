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
module.exports = router;