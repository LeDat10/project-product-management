const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
// const productHelper = require("../../helper/product");

//[GET] ./api/carts
module.exports.index = async (req, res) => {
    try {
        const cartId = req.cart.id;

        const cart = await Cart.findOne({
            _id: cartId
        }).lean();

        if (cart.products.length > 0) {
            for (const item of cart.products) {
                const product = await Product.findOne({
                    _id: item.product_id
                });
                item.price = product.price;
                item.discountPercentage = product.discountPercentage;
                item.titleProduct = product.title;
                item.thumbnail = product.thumbnail;
                item.stock = product.stock;
            };
        };

        res.json({
            code: 200,
            message: "Lấy giỏ hàng thành công!",
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

        const cart = await Cart.findOne({
            _id: cartId
        });

        const existProductInCart = cart.products.find(item => item.product_id === productId);

        if (existProductInCart) {
            const newQuantity = quantity + existProductInCart.quantity;
            await Cart.updateOne({
                _id: cartId,
                "products.product_id": productId
            }, {
                'products.$.quantity': newQuantity,
            });

        } else {
            const objectCart = {
                product_id: productId,
                quantity: quantity,
            }

            await Cart.updateOne({
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

// [DELETE] /carts/delete/:productId
module.exports.delete = async (req, res) => {
    try {
        const productId = req.params.productId;
        console.log(productId);
        const cartId = req.cart.id;

        await Cart.updateOne({
            _id: cartId
        }, {
            "$pull": { products: { "product_id": productId } }
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

//[PATCH] /api/carts/update/:productId
module.exports.update = async (req, res) => {
    try {
        const productId = req.params.productId;
        const quantity = req.body.quantity;
        const cartId = req.cart.id;

        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId
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

// [PATCH] /api/carts/select
module.exports.select = async (req, res) => {
    try {
        const cartId = req.cart.id;
        const productSelected = req.body.productSelected;
        console.log(productSelected);
        const products = [];
        if (productSelected.length > 0) {
            for (const product of productSelected) {
                const productUpdate = await Cart.updateOne({
                    _id: cartId,
                    "products.product_id": product
                }, {
                    "products.$.selected": true
                });

                products.push(productUpdate);
            };
        };

        res.json({
            code: 200,
            message: "Chọn sản phẩm thành công!",
            products: products
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Chọn sản phẩm thất bại!"
        });
    };
};

