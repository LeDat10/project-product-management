const Order = require("../../models/order.model");
const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

// const productHelper = require("../../helper/product");

// [POST] /api/order/confirm
module.exports.order = async (req, res) => {
    try {
        // const cartId = req.cart.id;
        const userInfo = req.body.userInfo;
        const userId = req.user.id;

        const cart = await Cart.findOne({
            user_id: userId,
            products: { $elemMatch: { selected: true } }
        });

        console.log(cart);

        let productSelects = [];

        if (cart.products.length > 0) {
            productSelects = cart.products.filter(item => item.selected === true);
            for (const product of productSelects) {
                const productInfo = await Product.findOne({
                    _id: product.product_id
                });
                product.discountPercentage = productInfo.discountPercentage;
                product.price = productInfo.price;
            };
        };

        const objectOrder = {
            cart_id: cart.id,
            user_id: userId,
            userInfo: userInfo,
            products: productSelects
        };

        const order = Order(objectOrder);
        await order.save();
        res.json({
            code: 200,
            message: "Đặt hàng thành công!",
            orderId: order.id
        });

    } catch (error) {
        res.json({
            code: 400,
            message: "Đặt hàng thất bại!"
        });
    };
};

// [GET] /api/order/:orderId
module.exports.orderInfo = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const order = await Order.findOne({
            _id: orderId,
            user_id: req.user.id
        }).select("cartId userInfo products").lean();

        if (order.products.length > 0) {
            for (const product of order.products) {
                const productInfo = await Product.findOne({
                    _id: product.product_id
                });
                product.titleProduct = productInfo.title;
                product.thumbnail = productInfo.thumbnail;
            };
        };

        res.json({
            code: 200,
            message: "Lấy đơn hàng thành công!",
            order: order
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy đơn hàng thất bại!"
        });
    }
}