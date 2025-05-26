const Account = require("../../models/account.model");
const jwt = require("jsonwebtoken");

module.exports.requireAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.json({
                code: 401,
                message: "Không có token nào được cung cấp!"
            });
        };

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            res.json({
                code: 401,
                message: "Token không hợp lệ. Vui lòng đăng nhập lại!"
            });
            return;
        };

        const account = await Account.findById(decoded.id);
        // console.log(account);
        if (!account) {
            res.json({
                code: 401,
                message: "Tài khoản không tồn tại!"
            });
            return;
        };

        if (account.tokenVersion !== decoded.tokenVersion) {
            res.json({
                code: 401,
                message: "Token không hợp lệ. Vui lòng đăng nhập lại!"
            });
            return;
        };
        req.account = account;
        next();
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi từ server"
        });
    }
};