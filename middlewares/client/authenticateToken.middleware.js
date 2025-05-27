const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
module.exports.authenticateToken = async (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!token) {
                return res.json({
                    code: 401,
                    message: "Không có token nào được cung cấp!"
                });
            };

            if (!decoded) {
                res.json({
                    code: 401,
                    message: "Token không hợp lệ hoặc đã hết hạn!"
                });
                return;
            };

            const user = await User.findById(decoded.id).select("fullName avatar phone tokenVersion email isVerified status");
            if (!user) {
                res.json({
                    code: 401,
                    message: "Tài khoản không tồn tại!"
                });
                return;
            };

            if (user.tokenVersion !== decoded.tokenVersion) {
                res.json({
                    code: 401,
                    message: "Token không hợp lệ hoặc đã hết hạn!"
                });
                return;
            };

            req.user = user;
            next();
        } else {
            next();
        };
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi từ server"
        });
    };
};