const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
// [POST] /api/users/register
module.exports.register = async (req, res) => {
    try {
        const existEmail = await User.findOne({
            email: req.body.email,
            deleted: false,
            status: "active"
        });

        if(existEmail) {
            res.json({
                code: 409,
                message: "Email này đã được đăng ký!"
            });
            return;
        };

        const userToken = jwt.sign({}, process.env.JWT_SECRET);
        req.body.token = userToken;
        req.body.password = await argon2.hash(req.body.password);
        const user = User(req.body);
        await user.save();
        res.json({
            code: 200,
            message: "Đăng ký tài khoản thành công!"
        });

    } catch (error) {
        res.json({
            code: 400,
            message: "Đăng ký tài khoản thất bại!"
        });
    };
};

//[POST] /api/users/login
module.exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({
            email: email,
            deleted: false
        });

        if(!user) {
            res.json({
                code: 401,
                message: "Email đăng nhập không tồn tại!"
            });
            return;
        }

        const match = await argon2.verify(user.password, password);

        if(!match) {
            res.json({
                code: 401,
                message: "Mật khẩu đăng nhập không đúng!"
            });
            return;
        };

        const token = user.token;

        res.json({
            code: 200,
            message: "Đăng nhập tài công!",
            token: token
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Đăng nhập thất bại!"
        });
    }
};