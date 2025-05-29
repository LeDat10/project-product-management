const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/order.controller");

router.get("/", controller.index);

router.patch("/change-multi", controller.changeMulti);

router.get("/detail/:orderId", controller.detail);

router.get("/trash", controller.trash);

router.patch("/trash/restore", controller.restore);

router.delete("/trash/delete/:productId", controller.deletePermanently);

router.patch("/trash/restore-multi", controller.restoreMulti);

module.exports = router;