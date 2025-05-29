const Order = require("../../models/order.model");
const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");


const productHelper = require("../../helper/product");
const generateHelper = require("../../helper/generate");

// [GET] /api/order
module.exports.index = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.findOne({
            user_id: userId,
            deleted: false
        }).select("status payment totalPrice products userInfo");

        return res.json({
            code: 200,
            message: "Lấy danh sách đơn hàng thành công!",
            orders: orders
        });
    } catch (error) {
        return res.json({
            code: 400,
            message: "Lấy danh sách đơn hàng thất bại!"
        });
    };
};

// [POST] /api/order/confirm
module.exports.order = async (req, res) => {
    try {
        const userInfo = req.body.userInfo;
        const userId = req.user.id;
        const cart = await Cart.findOne({
            user_id: userId,
            products: { $elemMatch: { selected: true } }
        }).lean();

        let productSelects = [];

        if (cart.products.length > 0) {
            productSelects = cart.products.filter(item => item.selected === true);
            for (const product of productSelects) {
                const productInfo = await Product.findOne({
                    _id: product.product_id
                });
                product.discountPercentage = productInfo.discountPercentage;
                product.price = productInfo.price;
                product.priceNew = productHelper.pricenewProduct(productInfo);
            };
        };

        const totalPrice = Math.ceil(productSelects.reduce((sum, product) => sum + product.priceNew * product.quantity, 0));

        const objectOrder = {
            cart_id: cart.id,
            user_id: userId,
            userInfo: userInfo,
            products: productSelects,
            totalPrice: totalPrice
        };

        const order = Order(objectOrder);
        await order.save();

        await Cart.updateOne(
            { user_id: userId },
            {
                $set: {
                    "products.$[elem].selected": false
                }
            },
            {
                arrayFilters: [{ "elem.selected": true }]
            }
        );

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
            user_id: req.user.id,
            deleted: false
        }).select("cartId userInfo products totalPrice status").lean();

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
};

//[get] /api/order/payment-data/:orderId
module.exports.paymentData = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findOne({
            _id: orderId,
            deleted: false
        });

        if (!order) {
            return res.json({
                code: 404,
                message: "Không tìm thấy đơn hàng!"
            });
        };

        if (order.user_id !== req.user.id) {
            return res.json({
                code: 403,
                message: "Bạn không có quyền xem đơn hàng này!"
            });
        };

        const hmac = generateHelper.createHmac(order.id);

        res.json({
            code: 200,
            message: "Lấy thông tin đơn hàng thành công",
            paymentData: {
                orderId: order._id,
                amount: order.totalPrice,
                hmac: hmac
            }
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy thông tin đơn hàng thất bại!"
        });
    };
};

// [POST] /api/order/payment
module.exports.payment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId, amount, hmac } = req.body;
        amount = parseFloat(amount);
        const order = await Order.findOne({
            _id: orderId,
            deleted: false
        });

        if (!order) {
            res.json({
                code: 404,
                message: "Không tìm thấy đơn hàng!"
            });
            return;
        };

        if (order.user_id !== userId) {
            return res.json({
                code: 403,
                message: "Bạn không có quyền thanh toán đơn hàng này!"
            });
        };

        const expectedHmac = generateHelper.createHmac(orderId);
        if (expectedHmac !== hmac) {
            return res.json({
                code: 400,
                message: "Dữ liệu bị sửa đổi hoặc không hợp lệ!"
            });
        };

        if (amount < order.totalPrice) {
            const balance = order.totalPrice - amount;

            res.json({
                code: 400,
                message: `Thanh toán thất bại. Bạn còn thiếu ${balance}$!`
            });
            return;
        } else if (amount > order.totalPrice) {
            const balance = amount - order.totalPrice;
            res.json({
                code: 400,
                message: `Thanh toán thất bại. Bạn đã chuyển dư ${balance}$!`
            });
            return;
        };

        await Order.updateOne({
            _id: orderId,
        }, {
            status: "confirmed",
            payment: true
        });

        res.json({
            code: 200,
            message: "Thanh toán thành công!"
        });
    } catch (error) {
        res.json({
            code: 500,
            message: "Lỗi khi thanh toán!"
        });
    };
};