const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

// [GET] /api/accounts
module.exports.index = async (req, res) => {
    try {
        const accounts = await Account.find({
            deleted: false
        }).select("avatar fullName email status role_id").lean();

        for (const account of accounts) {
            const role = await Role.findOne({
                _id: account.role_id,
                deleted: false
            });
            account.roleTitle = role.title;
        };

        res.json({
            code: 200,
            accounts: accounts
        });
    } catch (error) {
        res.json({
            code: 400
        });
    }

};

// [POST] /api/accounts/create
module.exports.create = async (req, res) => {
    try {
        const emailExist = await Account.findOne({
            email: req.body.email,
            deleted: false
        });

        if (emailExist) {
            res.json({
                code: 409,
                message: "Email đã tồn tại!"
            });
        } else {
            const token = jwt.sign({}, process.env.JWT_SECRET);
            req.body.token = token;
            delete req.body["confirm-password"];
            req.body.password = await argon2.hash(req.body.password);
            const account = Account(req.body);
            await account.save();
            res.json({
                code: 200,
                message: "Tạo tài khoản thành công!"
            });
        };
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo tài khoản thất bại!"
        });
    }


    try {

    } catch (error) {

    }
};

// [PATCH] /api/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        await Account.updateOne({
            _id: id
        }, {
            status: status
        });

        res.json({
            code: 200,
            message: "Thay đổi trạng thái tài khoản thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Thay đổi trạng thái tài khoản thất bại!"
        });
    }
};

// [DELETE] /api/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        await Account.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: Date.now()
        });

        res.json({
            code: 200,
            message: "Xóa tài khoản thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa tài khoản thất bại!"
        });
    };
};

// [GET] /api/accounts/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const account = await Account.findOne({
            _id: id,
            deleted: false
        }).select("-password");

        res.json({
            code: 200,
            account: account
        });
    } catch (error) {
        res.json({
            code: 400
        });
    };
};

// [PATCH] /api/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        } else {
            delete req.body.password;
        }

        delete req.body["confirm-password"];

        await Account.updateOne({
            _id: req.params.id
        }, req.body);
        res.json({
            code: 200
        });
    } catch (error) {
        res.json({
            code: 400
        });
    }
};

// [PATCH] /api/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        } else {
            delete req.body.password;
        }

        delete req.body["confirm-password"];

        await Account.updateOne({
            _id: req.params.id
        }, req.body);
        res.json({
            code: 200
        });
    } catch (error) {
        res.json({
            code: 400
        });
    }
};

// [POST] /api/accounts/login
module.exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const account = await Account.findOne({
            email: email,
            deleted: false
        });

        if(!account) {
            res.json({
                code: 401,
                message: "Email đăng nhập không tồn tại!"
            });
            return;
        }

        const match = await argon2.verify(account.password, password);

        if(!match) {
            res.json({
                code: 401,
                message: "Mật khẩu đăng nhập không đúng!"
            });
            return;
        }

        const token = account.token;

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

// [GET] /api/accounts/get-role
module.exports.getRole = async (req, res) => {
    try {
        const roleId = req.account.role_id;
        const role = await Role.findOne({
            _id: roleId,
            deleted: false
        });
        res.json({
            code: 200,
            permissions: role.permissions
        });
    } catch (error) {
        res.json({
            code: 400
        });
    };
}