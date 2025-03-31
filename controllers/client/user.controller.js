const User = require("../../models/user.model");
const Confirm = require("../../models/confirm.model");
const Cart = require("../../models/cart.model");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");


const generateHelper = require("../../helper/generate");
const sendMailHelper = require("../../helper/sendMail");


// [POST] /api/users/register
module.exports.register = async (req, res) => {
    try {
        const existEmail = await User.findOne({
            email: req.body.email,
            deleted: false,
            status: "active"
        });

        if (existEmail) {
            res.json({
                code: 409,
                message: "Email này đã được đăng ký!"
            });
            return;
        };

        const userIsVerified = await User.findOne({
            email: req.body.email,
            isVerified: false,
            status: "inactive"
        }).select("email phone");

        if (userIsVerified) {
            const otp = generateHelper.generateRadomNumber(6);

            const objectConfirm = {
                email: userIsVerified.email,
                otp: otp,
                expireAt: Date.now()
            };

            const cofirmUser = Confirm(objectConfirm);
            await cofirmUser.save();

            const subject = "Mã OTP xác thực tài khoản";
            const html = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9; text-align: center;">
                <h2 style="color: #333;">🎉 Xác thực tài khoản của bạn</h2>
                <p>Chào bạn,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhập mã OTP bên dưới để xác thực tài khoản của bạn:</p>
                <h3 style="font-size: 24px; color: #ff5722; background: #ffcc00; padding: 10px; text-align: center; border-radius: 5px; display: inline-block;">${otp}</h3>
                <p><b>Lưu ý:</b> Mã này sẽ hết hạn sau <b>3 phút</b>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
                <br>
                <p>Trân trọng,</p>
                <p><b>Đội ngũ hỗ trợ nhóm 2 đồ án đa nền tảng.</b></p>
            </div>
        `;

            const email = userIsVerified.email;

            sendMailHelper.sendMail(email, subject, html);

            res.json({
                code: 200,
                message: "OTP đã được gửi về email đăng ký. Vui lòng xác thực tài khoản!",
                user: userIsVerified
            });
            return;
        };

        const userToken = jwt.sign({}, process.env.JWT_SECRET);
        req.body.token = userToken;
        req.body.password = await argon2.hash(req.body.password);
        const user = User(req.body);
        await user.save();

        const userRegister = await User.findOne({
            _id: user.id
        }).select("email phone");

        const otp = generateHelper.generateRadomNumber(6);

        const objectConfirm = {
            email: userRegister.email,
            otp: otp,
            expireAt: Date.now()
        };

        const cofirmUser = Confirm(objectConfirm);
        await cofirmUser.save();

        const subject = "Mã OTP xác thực tài khoản";
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9; text-align: center;">
                <h2 style="color: #333;">🎉 Xác thực tài khoản của bạn</h2>
                <p>Chào bạn,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhập mã OTP bên dưới để xác thực tài khoản của bạn:</p>
                <h3 style="font-size: 24px; color: #ff5722; background: #ffcc00; padding: 10px; text-align: center; border-radius: 5px; display: inline-block;">${otp}</h3>
                <p><b>Lưu ý:</b> Mã này sẽ hết hạn sau <b>3 phút</b>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
                <br>
                <p>Trân trọng,</p>
                <p><b>Đội ngũ hỗ trợ nhóm 2 đồ án đa nền tảng.</b></p>
            </div>
        `;

        const email = userRegister.email;

        sendMailHelper.sendMail(email, subject, html);

        res.json({
            code: 200,
            message: "OTP đã được gửi về email đăng ký. Vui lòng xác thực tài khoản!",
            user: userRegister
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Đăng ký tài khoản thất bại!"
        });
    };
};


// [POST] /api/users/register/confirmOTP
module.exports.confirmOTP = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;

        const result = await Confirm.findOne({
            email: email,
            otp: otp
        });

        if (!result) {
            res.json({
                code: 400,
                message: "Mã OTP không hợp lệ!"
            });
            return;
        };

        await User.updateOne({
            email: email
        }, {
            status: "active",
            isVerified: true
        });

        res.json({
            code: 200,
            message: "Xác thực và đăng ký tài khoản thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xác thực và đăng ký tài khoản thất bại!"
        })
    }

}

//[POST] /api/users/login
module.exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({
            email: email,
            deleted: false,
            status: "active",
            isVerified: true
        });

        if (!user) {
            res.json({
                code: 401,
                message: "Email đăng nhập không tồn tại!"
            });
            return;
        }

        const match = await argon2.verify(user.password, password);

        if (!match) {
            res.json({
                code: 401,
                message: "Mật khẩu đăng nhập không đúng!"
            });
            return;
        };

        const token = user.token;

        const cart = await Cart.findOne({
            user_id: user.id
        });

        let cartId;

        if (cart) {
            cartId = cart.id;
            console.log(cartId);
        } else {
            cartId = req.cart.id;
            console.log(cartId);
            await Cart.updateOne({
                _id: cartId
            }, {
                user_id: user.id
            });
        }

        res.json({
            code: 200,
            message: "Đăng nhập thành công!",
            token: token,
            cartId: cartId
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Đăng nhập thất bại!"
        });
    };
};

//[POST] /api/users/password/forgot
module.exports.forgot = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false,
        status: "active",
        isVerified: true
    });

    if (!user) {
        res.json({
            code: 404,
            message: "Email không tồn tại!"
        });
        return;
    };

    const otp = generateHelper.generateRadomNumber(6);
    const objectForgot = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };

    const forgotPassword = Confirm(objectForgot);
    await forgotPassword.save();

    const subject = `Mã OTP xác minh đặt lại mật khẩu`;

    const html = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="color: #333;">Yêu cầu đặt lại mật khẩu</h2>
                <p>Chào bạn,</p>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã OTP bên dưới để tiếp tục:</p>
                <h3 style="background-color: #ffcc00; padding: 10px; text-align: center; border-radius: 5px;">${otp}</h3>
                <p><b>Lưu ý:</b> Mã này sẽ hết hạn sau <b>3 phút</b>.Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
                <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này hoặc liên hệ hỗ trợ.</p>
                <br>
                <p>Trân trọng,</p>
                <p><b>Đội ngũ hỗ trợ nhóm 2 đồ án đa nền tảng.</b></p>
            </div>
        `;

    sendMailHelper.sendMail(email, subject, html);


    try {
        res.json({
            code: 200,
            message: "Đã gửi mã OTP qua email!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Gửi mã OTP qua email thất bại!"
        });
    };
};

// [POST] /api/users/password/otp
module.exports.otpPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;

        const result = await Confirm.findOne({
            email: email,
            otp: otp
        });

        if (!result) {
            res.json({
                code: 400,
                message: "Mã OTP không hợp lệ!"
            });
            return;
        };

        const user = await User.findOne({
            email: email
        });

        const token = user.token;

        res.json({
            code: 200,
            message: "Xác thực email thành công!",
            token: token
        });

    } catch (error) {
        res.json({
            code: 400,
            message: "Xác thực email thất bại!"
        });
    };
};

//[POST] /api/users/password/reset
module.exports.resetPassword = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const password = req.body.password;

        const user = await User.findOne({
            token: token
        });

        const match = await argon2.verify(user.password, password);

        if (match) {
            res.json({
                code: 409,
                message: "Mật khẩu mới không thể trùng với mật khẩu cũ!"
            });
            return;
        };

        const newPassword = await argon2.hash(password);

        await User.updateOne({
            token: token
        }, {
            password: newPassword
        });

        res.json({
            code: 200,
            message: "Đổi mật khẩu thành công!"
        });

    } catch (error) {
        res.json({
            code: 400,
            message: "Đổi mật khẩu thất bại!"
        });
    };
};