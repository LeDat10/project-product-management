const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    try {
        if (!req.user) {
            if (!req.headers.cartid) {
                const cart = new Cart();
                await cart.save();
                console.log(cart.id);

                res.setHeader("cartId", cart.id);

                req.cart = cart;

            } else {
                const cartId = req.headers.cartid;
                res.setHeader("cartId", cartId);
                const cart = await Cart.findOne({
                    _id: cartId
                });
                req.cart = cart;
            };
        } else {
            const userId = req.user.id;

            const cart = await Cart.findOne({
                user_id: userId
            });
            if (cart) {
                req.cart = cart;
                res.setHeader("cartId", cart.id);
            } else {
                const cart = new Cart({
                    user_id: user.id
                });
                await cart.save();

                res.setHeader("cartId", cart.id);

                req.cart = cart;
            };
        };
        next();
    } catch (error) {
        res.json({
            code: 400
        });
    };
};