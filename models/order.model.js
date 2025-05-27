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
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: {
            account_id: String,
            deletedAt: Date
        },
        updatedBy: [
            {
                account_id: String,
                updatedAt: Date
            }
        ]
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;