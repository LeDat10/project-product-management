const Account = require("../../models/account.model");

module.exports.requireAuth = async(req, res, next) => {
    if(req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];

        const account = await Account.findOne({
            token: token,
            deleted: false
        }).select("-password");

        if(!account) {
            res.json({
                code: 400,
                message: "Tài khoản không hợp lệ!"
            });
            return;
        }

        req.account = account;
        next();
    } else {
        req.json({
            code: 400,
            message: "Vui lòng gửi kèm token!"
        });
    }
};