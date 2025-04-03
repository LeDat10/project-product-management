const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
module.exports.requireAuth = async (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
                if (error) {
                    res.json({
                        code: 400,
                        message: "Token không đúng hoặc đã hết hạn!"
                    });
                    return;
                };

                const infoUser = await User.findOne({
                    _id: user.id
                }).select("fullName email avatar phone status");
                if (!infoUser) {
                    res.json({
                        code: 400,
                        message: "Người dùng không tồn tại!"
                    });
                    return;
                };
                req.user = infoUser;
                next();
            });
        } else {
            res.json({
                code: 400,
                message:"Vui lòng gửi kèm token!"
            });
        };
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi từ server"
        });
    };
};