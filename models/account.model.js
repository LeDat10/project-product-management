const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const accountchema = new mongoose.Schema(
    {
        fullName: String,
        email: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        phone: String,
        avatar: {
            type: String,
            default: "https://res.cloudinary.com/dgzkzwb4z/image/upload/v1745937431/fpp2s2tkgwrrxz3ydiui.jpg"
        },
        role_id: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            required: true
        },
        slug: {
            type: String,
            slug: "fullName",
            unique: true
        },
        tokenVersion: {
            type: Number,
            default: 0
        },
        deleted: {
            type: Boolean,
            default: false
        },
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now()
            }
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

const Account = mongoose.model("Account", accountchema, "accounts");
module.exports = Account;