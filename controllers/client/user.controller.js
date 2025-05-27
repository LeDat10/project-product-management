const User = require("../../models/user.model");
const Confirm = require("../../models/confirm.model");
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
        };

        const match = await argon2.verify(user.password, password);

        if (!match) {
            res.json({
                code: 401,
                message: "Mật khẩu đăng nhập không đúng!"
            });
            return;
        };

        const payload = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            tokenVersion: user.tokenVersion,
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE
            }
        );


        res.json({
            code: 200,
            message: "Đăng nhập thành công!",
            token: token
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
        const { email, otp } = req.body;

        const userConfirm = await Confirm.findOne({
            email: email,
            otp: otp
        });

        if (!userConfirm) {
            return res.json({
                code: 400,
                message: "Mã OTP không hợp lệ hoặc đã hết hạn!"
            });
        };

        const token = jwt.sign(
            { email: userConfirm.email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({
            code: 200,
            message: "Xác thực email thành công!",
            tokenReset: token
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
        const { token, newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });

        if (!user) return res.json({
            code: 400,
            message: "Người dùng không tồn tại"
        });

        const isSame = await argon2.verify(user.password, newPassword);

        if (isSame) {
            return res.json({
                code: 400,
                message: "Mật khẩu mới không được trùng mật khẩu cũ"
            });
        };

        const hashedPassword = await argon2.hash(newPassword);
        user.password = hashedPassword;
        await user.save();

        return res.json({
            code: 200,
            message: "Đặt lại mật khẩu thành công"
        });
    } catch (error) {
        return res.json({
            code: 400,
            message: "Token không hợp lệ hoặc đã hết hạn"
        });
    };
};

module.exports.getInfoUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("fullName avatar phone email isVerified status");
        res.json({
            code: 200,
            message: "Lấy thông tin người dùng thành công!",
            user: user
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy thông tin người dùng thất bại!"
        });
    };
};

// [POST] /api/users/logout
module.exports.logout = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.updateOne({
            _id: userId,
            deleted: false,
            isVerified: true,
            status: "active"
        }, { $inc: { tokenVersion: 1 } });

        return res.json({
            code: 200,
            message: "Đăng xuất tài khoản thành công!"
        });
    } catch (error) {
        return res.json({
            code: 400,
            message: "Đăng xuất tài khoản thất bại!"
        });
    };
};

// [PATCH] /api/users/edit
module.exports.edit = async (req, res) => {
    try {
        const id = req.user._id;
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        };

        await User.updateOne({
            _id: id
        }, req.body);
        res.json({
            code: 200,
            message: "Chỉnh sửa tài khoản thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Chỉnh sửa tài khoản thất bại!"
        });
    }
};