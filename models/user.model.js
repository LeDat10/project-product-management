const mongoose = require("mongoose");

const userchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        tokenUser: String,
        phone: String,
        avatar: String,
        address: String,
        status: {
            type: String,
            default: "active"
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userchema, "users");
module.exports = User;