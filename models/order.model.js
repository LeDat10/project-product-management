const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        cart_id: String,
        user_id: String,
        userInfo: {
            fullName: String,
            phone: String,
            address: String
        },
        products: [
            {
                product_id: String,
                quantity: Number,
                price: Number,
                discountPercentage: Number,
                priceNew: Number
            }
        ],
        totalPrice: Number,
        payment: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "confirmed", "shipping", "delivered", "cancelled", "refunded"],
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;