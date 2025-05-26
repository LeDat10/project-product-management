const express = require("express");
const multer = require("multer");
const upload = multer();

const router = express.Router();

const controller = require("../../controllers/admin/role.controller");

const uploadToCloudHelper = require("../../helper/uploadToCloudinary");

router.get("/", controller.index);

router.post("/create", controller.create);

router.delete("/delete/:id", controller.delete);

router.patch("/edit/:id", controller.edit);

router.get("/detail/:id", controller.detail);

router.patch("/permissions", controller.permissions);

router.get("/trash", controller.trash);

router.patch("/trash/restore", controller.restore);

router.delete("/trash/delete/:roleId", controller.deletePermanently);

router.patch("/trash/restore-multi", controller.restoreMulti);

module.exports = router;