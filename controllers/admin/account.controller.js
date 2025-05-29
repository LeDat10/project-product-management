const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

// [GET] /api/accounts
module.exports.index = async (req, res) => {
    try {

        const find = {
            deleted:false
        };
        const sort = {};

        // Sort
        if (req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort.fullName = "asc";
        }

        // Filter
        if (req.query.status) {
            find.status = req.query.status;
        }
        // End Filter

        // pagination
        const objPagination = {
            currentPage: 1,
            limit: 5
        };

        if (req.query.page) {
            objPagination.currentPage = parseInt(req.query.page);
        };

        if (req.query.limit) {
            objPagination.limit = parseInt(req.query.limit);
        }

        objPagination.skip = (objPagination.currentPage - 1) * objPagination.limit;
        // End pagination

        const accounts = await Account.find(find)
            .sort(sort)
            .limit(objPagination.limit)
            .skip(objPagination.skip)
            .select("avatar fullName email status role_id updatedBy")
            .lean();

        for (const account of accounts) {
            const role = await Role.findOne({
                _id: account.role_id,
                deleted: false
            });

            if (role) {
                account.roleTitle = role.title
            };
        };

        await Promise.all(accounts.map(async (account) => {
            if (account.updatedBy?.length) {
                const updatedBy = account.updatedBy[account.updatedBy.length - 1];
                const userUpdated = await Account.findOne({
                    _id: updatedBy.account_id
                }).lean();

                if (userUpdated) {
                    updatedBy.accountFullName = userUpdated.fullName;
                }

                account.updatedBy = updatedBy;
            }
        }));

        const totalAccount = await Account.countDocuments({
            deleted: false
        });

        res.json({
            code: 200,
            message: "Lấy danh sách tài khoản thành công!",
            accounts: accounts,
            totalAccount: totalAccount
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy danh sách tài khoản thất bại!",
        });
    };
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
            delete req.body["confirm-password"];
            req.body.password = await argon2.hash(req.body.password);
            req.body.createdBy = {
                account_id: req.account._id
            };
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
    };
};

// [PATCH] /api/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;
        const updatedBy = {
            account_id: req.account._id,
            updatedAt: new Date()
        };

        await Account.updateOne({ _id: id }, {
            status: status,
            $push: { updatedBy: updatedBy }
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

        await Account.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: {
                account_id: req.account._id,
                deletedAt: new Date()
            }
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
        })
            .select("avatar fullName email status role_id updatedBy deletedBy createdBy")
            .lean();

        const role = await Role.findOne({
            _id: account.role_id,
            deleted: false
        });

        if (role) {
            account.roleTitle = role.title
        };


        if (account.updatedBy?.length) {
            for (const item of account.updatedBy) {
                const userUpdated = await Account.findOne({
                    _id: item.account_id
                }).lean();

                if (userUpdated) {
                    item.accountFullName = userUpdated.fullName;
                };
            };
        };

        if (account.createdBy) {
            const userCreated = await Account.findOne({
                _id: account.createdBy.account_id
            }).lean();

            if (userCreated) {
                account.createdBy.accountFullName = userCreated.fullName;
            };
        };

        if (account.deletedBy) {
            const userDeleted = await Account.findOne({
                _id: account.deletedBy.account_id
            }).lean();

            if (userDeleted) {
                account.deletedBy.accountFullName = userDeleted.fullName;
            };
        };

        res.json({
            code: 200,
            account: account,
            message: "Lấy chi tiết tài khoản thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy chi tiết tài khoản thất bại`!"
        });
    };
};

// [PATCH] /api/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        } else {
            delete req.body.password;
        }

        delete req.body["confirm-password"];

        const updatedBy = {
            account_id: req.account._id,
            updatedAt: new Date()
        };

        await Account.updateOne({
            _id: id
        }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        });
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


// [POST] /api/accounts/login
module.exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const account = await Account.findOne({
            email: email,
            deleted: false
        });

        if (!account) {
            res.json({
                code: 401,
                message: "Email đăng nhập không tồn tại!"
            });
            return;
        }

        const match = await argon2.verify(account.password, password);

        if (!match) {
            res.json({
                code: 401,
                message: "Mật khẩu đăng nhập không đúng!"
            });
            return;
        };

        if(account.status === "inactive") {
            return res.json({
                code: 400,
                message: "Tài khoản này đã bị khóa. Không thể đăn nhập!"
            });
        };

        const role = await Role.findOne({
            _id: account.role_id
        });

        const payload = {
            id: account._id,
            email: account.email,
            fullName: account.fullName,
            tokenVersion: account.tokenVersion,
            permissions: role.permissions
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
};

// [GET] /api/admin/accounts/trash
module.exports.trash = async (req, res) => {
    try {
        const find = {
            deleted: true
        };

        const sort = {};

        // Sort
        if (req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort.title = "asc";
        }

        // pagination
        const objPagination = {
            currentPage: 1,
            limit: 5
        };

        if (req.query.page) {
            objPagination.currentPage = parseInt(req.query.page);
        };

        if (req.query.limit) {
            objPagination.limit = parseInt(req.query.limit);
        }

        objPagination.skip = (objPagination.currentPage - 1) * objPagination.limit;
        // End pagination

        const accounts = await Account.find(find).sort(sort).limit(objPagination.limit).skip(objPagination.skip);
        const totalAccount = await Account.countDocuments({
            deleted: true
        });

        res.json({
            code: 200,
            message: "Lấy danh sách tài khoản thành công!",
            accounts: accounts,
            totalAccount: totalAccount
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy danh sách tài khoản thất bại!"
        });
    };
};

//[PATCH] /api/admin/accounts/trash/restore
module.exports.restore = async (req, res) => {
    try {
        const accountId = req.body.accountId;
        await Account.updateOne({
            _id: accountId
        }, {
            deleted: false
        });

        res.json({
            code: 200,
            message: "Khôi phục tài khoản thành công!"
        });

    } catch (error) {
        res.json({
            code: 400,
            message: "Khôi phục tài khoản thất bại!"
        });
    };
};

//[DELETE] /api/admin/accounts/trash/delete/:accountId
module.exports.deletePermanently = async (req, res) => {
    try {
        const accountId = req.params.accountId;
        await Account.deleteOne({ _id: accountId });
        res.json({
            code: 200,
            message: "Xóa vĩnh viễn tài khoản thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa vĩnh viễn tài khoản thất bại!"
        });
    };
};

//[PATCH] /api/admin/accounts/trash/restore-multi
module.exports.restoreMulti = async (req, res) => {
    try {
        const { ids, key } = req.body;
        switch (key) {
            case 'restore':
                await Account.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: false
                });
                res.json({
                    code: 200,
                    message: "Khôi phục tài khoản thành công!"
                })
                break;
            case 'delete':
                await Account.deleteMany({
                    _id: { $in: ids }
                });

                res.json({
                    code: 200,
                    message: "Xóa vĩnh viễn tài khoản thành công!"
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Khôi phục/xóa tài khoản thất bại!"
                });
                break;
        };
    } catch (error) {
        res.json({
            code: 400,
            message: "Khôi phục/xóa tài khoản thất bại!"
        });
    };
};

// [GET] /api/admin/accounts/get-roles
module.exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find({
            deleted: false
        });

        res.json({
            code: 200,
            message: "Lấy danh sách nhóm quyền thành công!",
            roles: roles
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy danh sách nhóm quyền thất bại!"
        });
    };
};

// [POST] /api/admin/accounts/logout
module.exports.logout = async (req, res) => {
    try {
        const accountId = req.account._id;
        await Account.updateOne({
            _id: accountId,
            deleted: false,
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

// [GET] /api/admin/accounts/info-account
module.exports.infoAccount = async (req, res) => {
    try {
        const accountId = req.account._id;

        const account = await Account.findOne({
            _id: accountId,
            deleted: false,
            status: "active"
        }).select("fullName email avatar phone status role_id createdAt").lean();

        const role = await Role.findOne({
            _id: account.role_id,
            deleted: false
        });

        if (role) {
            account.roleTitle = role.title
        };

        if (!account) {
            return res.json({
                code: 400,
                message: "Không tìm thấy tài khoản!"
            });
        };

        return res.json({
            code: 200,
            message: "Lấy tài khoản thành công!",
            account: account
        });
    } catch (error) {
        return res.json({
            code: 400,
            message: "Lấy tài khoản thất bại!"
        });
    };
};