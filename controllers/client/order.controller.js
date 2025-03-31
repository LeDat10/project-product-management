const Order = require("../../models/order.model");
const Cart = require("../../models/cart.model");

const productHelper = require("../../helper/product");

// [POST] /api/order
module.exports.order = async (req, res) => {
    try {
        const cartId = req.cart.id;
        const userInfo = req.body.userInfo;
        


    } catch (error) {

    }
}