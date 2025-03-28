const Cart = require("../../models/cart.model");

const productHelper = require("../../helper/product");

//[GET] ./api/carts
module.exports.index = async (req, res) => {
    try {
        const cartId = req.cart.id;

        const cart = await Cart.findOne({
            _id: cartId
        }).lean();

        if (cart.products.length > 0) {
            for (const item of cart.products) {
                item.priceNew = productHelper.pricenewProduct(item);
                item.totalPrice = item.quantity * item.priceNew;
            };
        };

        cart.total = cart.products.reduce((sum, item) => sum = sum + item.totalPrice, 0);
        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        res.json({
            code: 200,
            cart: cart
        });
    } catch (error) {
        res.json({
            code: 400
        });
    };
};

// [POST] /api/carts/add/:productId
module.exports.addProduct = async (req, res) => {
    try {
        const cartId = req.cart.id;

        const productId = req.params.productId;

        const quantity = parseInt(req.body.quantity);

        const discountPercentage = parseFloat(req.body.discountPercentage);

        const price = parseFloat(req.body.price);

        const cart = await Cart.findOne({
            _id: cartId
        });

        const existProductInCart = cart.products.find(item => item.product_id === productId && item.discountPercentage === discountPercentage && item.price);
        let cartUpdate = {};

        if (existProductInCart) {
            const newQuantity = quantity + existProductInCart.quantity;
            cartUpdate = await Cart.updateOne({
                _id: cartId,
                "products.product_id": productId
            }, {
                'products.$.quantity': newQuantity,
            });

        } else {
            const objectCart = {
                product_id: productId,
                quantity: quantity,
                discountPercentage: discountPercentage,
                price: price
            }

            cartUpdate = await Cart.updateOne({
                _id: cartId
            }, {
                $push: { products: objectCart }
            });
        };

        res.json({
            code: 200,
            message: "Bạn đã thêm thành công sản phẩm vào giỏ hàng!"
        });

    } catch (error) {
        res.json({
            code: 400,
            message: "Thêm sản phẩm vào giỏ hàng thất bại!"
        });
    }
};

// [DELETE] /carts/delete/:objectId
module.exports.delete = async (req, res) => {
    try {
        const objectId = req.params.objectId;

        const cartId = req.cart.id;

        await Cart.updateOne({
            _id: cartId
        }, {
            "$pull": { products: { "_id": objectId } }
        });
        res.json({
            code: 200,
            message: "Xóa sản phẩm khỏi giỏ hàng thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa sản phẩm khỏi giỏ hàng thất bại!"
        });
    };
};

//[PATCH] /api/carts/update/:objectId
module.exports.update = async (req, res) => {
    try {
        const objectId = req.params.objectId;
        const quantity = req.body.quantity;
        const cartId = req.cart.id;

        await Cart.updateOne({
            _id: cartId,
            "products._id": objectId
        }, {
            "products.$.quantity": quantity
        });

        res.json({
            code: 200,
            message: "Cập nhật số lượng thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật số lượng thất bại!"
        });
    };
};