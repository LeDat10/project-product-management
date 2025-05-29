const User = require("../../models/user.model");
const Order = require("../../models/order.model");
// [GET] /api/admin/user
module.exports.index = async (req, res) => {
    try {
        const find = {
            deleted: false
        };

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


        const users = await User.find(find).limit(objPagination.limit).skip(objPagination.skip).select("-password");
        const totalUser = await User.countDocuments({
            deleted: false
        });

        return res.json({
            code: 200,
            message: "Lấy danh sách người dùng thành công!",
            users: users,
            totalUser: totalUser
        });
    } catch (error) {
        return res.json({
            code: 400,
            message: "Lấy danh sách người dùng thất bại!"
        });
    };
};

// [PATCH] /api/user/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        const updatedBy = {
            account_id: req.account._id,
            updatedAt: new Date()
        };

        await User.updateOne({ _id: id }, {
            status: status,
            $push: { updatedBy: updatedBy }
        });
        res.json({
            code: 200,
            message: "Cập nhật trạng thái người dùng thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái người dùng thất bại!"
        })
    }
};

// [PATCH] /api/user/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key } = req.body;

        const updatedBy = {
            account_id: req.account._id,
            updatedAt: new Date()
        };

        switch (key) {
            case "active":
                await User.updateMany({ _id: { $in: ids } }, {
                    status: "active",
                    $push: { updatedBy: updatedBy }
                });

                res.json({
                    code: 200,
                    message: "Thay đổi trạng thái người dùng thành công!"
                });
                break;
            case "inactive":
                await User.updateMany({ _id: { $in: ids } }, {
                    status: "inactive",
                    $push: { updatedBy: updatedBy }
                });

                res.json({
                    code: 200,
                    message: "Thay đổi trạng thái người dùng thành công!"
                });
                break;
            case "delete-all":
                await User.updateMany({ _id: { $in: ids } }, {
                    deleted: true,
                    deletedBy: {
                        account_id: req.account._id,
                        deletedAt: new Date()
                    }
                });

                res.json({
                    code: 200,
                    message: "Xóa nhiều người dùng thành công!"
                });
                break;

            default:
                res.json({
                    code: 400,
                    message: "Cập nhật trạng thái người dùng thất bại!"
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái người dùng thất bại!"
        });
    }
};

// [DELETE] /api/user/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await User.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: {
                account_id: req.account._id,
                deletedAt: new Date()
            }
        });
        res.json({
            code: 200,
            message: "Xóa người dùng thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa người dùng thất bại!"
        });
    };
};

// [GET] /api/admin/user/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({
            deleted: false,
            _id: id
        }).select("-password").lean();

        if (user.updatedBy?.length) {
            for (const item of user.updatedBy) {
                const userUpdated = await Account.findOne({
                    _id: item.account_id
                }).lean();

                if (userUpdated) {
                    item.accountFullName = userUpdated.fullName;
                };
            };
        };

        if (user.deletedBy) {
            const userDeleted = await Account.findOne({
                _id: user.deletedBy.account_id
            }).lean();

            if (userDeleted) {
                user.deletedBy.accountFullName = userDeleted.fullName;
            };
        };

        if (!user) {
            return res.json({
                code: 400,
                message: "Không tìm thấy người dùng!"
            });
        };
    } catch (error) {

    }
}