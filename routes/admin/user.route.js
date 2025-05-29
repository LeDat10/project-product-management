const express = require("express");
const multer = require("multer");
const upload = multer();

const router = express.Router();

const controller = require("../../controllers/admin/user.controller");

router.get("/", controller.index);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.delete);

router.get("/detail/:id", controller.detail);

router.get("/trash", controller.trash);

router.patch("/trash/restore", controller.restore);

router.delete("/trash/delete/:userId", controller.deletePermanently);

router.patch("/trash/restore-multi", controller.restoreMulti);

module.exports = router;