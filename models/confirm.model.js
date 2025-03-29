const mongoose = require("mongoose");

const confirmchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date, 
            expires: 180
        }
    },
    {
        timestamps: true
    }
);

const Confirm = mongoose.model("Confirm", confirmchema, "confirm");
module.exports = Confirm;