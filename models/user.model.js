const mongoose = require("mongoose");

const userchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        phone: String,
        avatar: String,
        isVerified: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            default: "inactive"
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