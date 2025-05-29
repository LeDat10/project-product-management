const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    try {
        const cartId = req.headers.cartid;
        // Nếu chưa đăng nhập
        if (!req.user) {
            if (!cartId) {
                const cart = new Cart();
                await cart.save();
                res.setHeader("cartId", cart.id);
                req.cart = cart;
            } else {
                let cart = await Cart.findOne({ _id: cartId });
                if (!cart) {
                    cart = new Cart();
                    await cart.save();
                    res.setHeader("cartId", cart.id);
                }
                req.cart = cart;
            }
        }
        // Nếu đã đăng nhập
        else {
            const userId = req.user._id;

            let cart;
            if (cartId) {
                cart = await Cart.findOne({ _id: cartId });

                if (cart && !cart.user_id) {
                    // Gán cart ẩn danh cho user
                    cart.user_id = userId;
                    await cart.save();
                }
            }

            if (!cart) {
                // Nếu cartId không có hoặc cart đã có user_id khác
                cart = await Cart.findOne({ user_id: userId });
            }

            if (!cart) {
                // Nếu không có cart nào, tạo mới
                cart = new Cart({ user_id: userId });
                await cart.save();
                res.setHeader("cartId", cart.id);
            }

            req.cart = cart;
        }

        next()
    } catch (error) {
        res.json({
            code: 400,
            message: "Không thể tìm thấy giỏ hàng!"
        });
    };
};