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
            let cart = null;

            if (cartId) {
                const foundCart = await Cart.findOne({ _id: cartId });

                if (foundCart) {
                    // Nếu cart chưa gán user → gán cho user hiện tại
                    if (!foundCart.user_id) {
                        foundCart.user_id = userId;
                        await foundCart.save();
                        cart = foundCart;
                    }
                    // Nếu cart đã thuộc user hiện tại → dùng luôn
                    else if (foundCart.user_id.toString() === userId.toString()) {
                        cart = foundCart;
                    }
                    // Nếu cart thuộc user khác → bỏ qua
                }
            }

            // Nếu chưa có cart hợp lệ từ cartId → tìm theo user_id
            if (!cart) {
                cart = await Cart.findOne({ user_id: userId });
            }

            // Nếu vẫn chưa có cart → tạo mới
            if (!cart) {
                cart = new Cart({ user_id: userId });
                await cart.save();
                res.setHeader("cartId", cart.id);
            }

            req.cart = cart;
        }

        next();
    } catch (error) {
        res.json({
            code: 400,
            message: "Không thể tìm thấy giỏ hàng!"
        });
    }
};
