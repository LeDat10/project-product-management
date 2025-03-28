const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user_id: String,
        products: [
            {
                product_id: String,
                quantity: Number,
                discountPercentage: Number,
                price: Number
            }
        ]
    },
    {
        timestamps: true
    }
);
 
const Cart = mongoose.model("Cart", cartSchema, "carts");
module.exports = Cart;