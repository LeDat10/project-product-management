const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    try {
        if (!req.headers.cartid) {
            
            const cart = new Cart();
            await cart.save();
            
            res.setHeader("cartId", cart.id);

            req.cart = cart;

        } else {
            const cartId = req.headers.cartid;

            const cart = await Cart.findOne({
                _id: cartId
            });

            const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

            cart.totalQuantity = totalQuantity;

            req.cart = cart;
        };
        next();
    } catch (error) {
        res.json({
            code: 400
        });
    };
};