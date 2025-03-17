const express = require("express");
const multer = require("multer");
const upload = multer();

const router = express.Router();

const controller = require("../../controllers/admin/product-category.controller");

const uploadToCloudHelper = require("../../helper/uploadToCloudinary");

router.get("/", controller.index);

router.post("/create", upload.single("thumbnail"), uploadToCloudHelper.uploadToCloud, controller.create);

module.exports = router;