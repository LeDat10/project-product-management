const Role = require("../../models/role.model");
const Account = require("../../models/account.model");

const convertToSlugHelper = require("../../helper/convertToSlug");
// [GET] /api/roles
module.exports.index = async (req, res) => {

    try {
        const find = {
            deleted: false
        };

        // Search
        if (req.query.keyword) {
            const keywordRegex = new RegExp(req.query.keyword, "i");
            const stringSlug = convertToSlugHelper.convertToSlug(req.query.keyword);
            const stringSlugRegex = new RegExp(stringSlug, "i");
            find["$or"] = [
                { title: keywordRegex },
                { slug: stringSlugRegex }
            ];
        };
        //End Search

        // Sort
        const sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort.title = "asc";
        }
        // End sort

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
        const roles = await Role.find(find).sort(sort).limit(objPagination.limit).skip(objPagination.skip).lean();
        const totalRole = await Role.countDocuments({
            deleted: false
        });

        await Promise.all(roles.map(async (role) => {
            if (role.updatedBy?.length) {
                const updatedBy = role.updatedBy[role.updatedBy.length - 1];
                const userUpdated = await Account.findOne({
                    _id: updatedBy.account_id
                }).lean();

                if (userUpdated) {
                    updatedBy.accountFullName = userUpdated.fullName;
                }

                role.updatedBy = updatedBy;
            }
        }));

        res.json({
            code: 200,
            message: "Lấy danh sách nhóm quyền thành công!",
            roles: roles,
            totalRole: totalRole
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy danh sách nhóm quyền thất bại!"
        });
    };
};

// [post] /api/roles/create
module.exports.create = async (req, res) => {
    try {
        req.body.createdBy = {
            account_id: req.account._id
        };
        const role = Role(req.body);
        await role.save();
        res.json({
            code: 200,
            message: "Thêm nhóm quyền thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Thêm nhóm quyền thất bại!"
        });
    };
};

// [DELETE] /api/roles/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: {
                account_id: req.account._id,
                deletedAt: new Date()
            }
        });

        res.json({
            code: 200,
            message: "Xóa nhóm quyền thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa nhóm quyền thất bại!"
        });
    }
};

// [PATCH] /api/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const updatedBy = {
            account_id: req.account._id,
            updatedAt: new Date()
        };

        await Role.updateOne({
            _id: id
        }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        });

        res.json({
            code: 200,
            message: "Chỉnh sửa nhóm quyền thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Chỉnh sửa nhóm quyền thất bại!"
        });
    }
};

// [GET] /api/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const role = await Role.findOne({
            _id: id,
            deleted: false
        }).lean();

        if (role.updatedBy?.length) {
            for (const item of role.updatedBy) {
                const userUpdated = await Account.findOne({
                    _id: item.account_id
                }).lean();

                if (userUpdated) {
                    item.accountFullName = userUpdated.fullName;
                };
            };
        };

        if (role.createdBy) {
            const userCreated = await Account.findOne({
                _id: role.createdBy.account_id
            }).lean();

            if (userCreated) {
                role.createdBy.accountFullName = userCreated.fullName;
            };
        };

        if (role.deletedBy) {
            const userDeleted = await Account.findOne({
                _id: role.deletedBy.account_id
            }).lean();

            if (userDeleted) {
                role.deletedBy.accountFullName = userDeleted.fullName;
            };
        };

        res.json({
            code: 200,
            role: role,
            message: "Lấy chi tiết nhóm quyền thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy chi tiết nhóm quyền thất bại!"
        });
    }
};

// [PATCH] /api/roles/permissions
module.exports.permissions = async (req, res) => {
    try {
        const { id, permissions } = req.body;

        const updatedBy = {
            account_id: req.account._id,
            updatedAt: new Date()
        };

        await Role.updateOne({
            _id: id
        }, {
            permissions: permissions,
            $push: { updatedBy: updatedBy }
        });

        await Account.updateMany({
            role_id: id
        }, { $inc: { tokenVersion: 1 } });

        res.json({
            code: 200,
            message: "Cập nhật phân quyền thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật phân quyền thất bại!"
        });
    };
};

// [GET] /api/admin/roles/trash
module.exports.trash = async (req, res) => {
    try {
        const find = {
            deleted: true
        };

        // Search
        if (req.query.keyword) {
            const keywordRegex = new RegExp(req.query.keyword, "i");
            const stringSlug = convertToSlugHelper.convertToSlug(req.query.keyword);
            const stringSlugRegex = new RegExp(stringSlug, "i");
            find["$or"] = [
                { title: keywordRegex },
                { slug: stringSlugRegex }
            ];
        };
        //End Search

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

        const roles = await Role.find(find).sort(sort).limit(objPagination.limit).skip(objPagination.skip);
        const totalRole = await Role.countDocuments({
            deleted: true
        });

        res.json({
            code: 200,
            message: "Lấy nhóm quyền thành công!",
            roles: roles,
            totalRole: totalRole
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy nhóm quyền thất bại!"
        });
    };
};

//[PATCH] /api/admin/roles/trash/restore
module.exports.restore = async (req, res) => {
    try {
        const roleId = req.body.roleId;
        await Role.updateOne({
            _id: roleId
        }, {
            deleted: false
        });

        res.json({
            code: 200,
            message: "Khôi phục nhóm quyền thành công!"
        });

    } catch (error) {
        res.json({
            code: 400,
            message: "Khôi phục nhóm quyền thất bại!"
        });
    };
};

//[DELETE] /api/admin/roles/trash/delete/:roleId
module.exports.deletePermanently = async (req, res) => {
    try {
        const roleId = req.params.roleId;
        await Role.deleteOne({ _id: roleId });
        res.json({
            code: 200,
            message: "Xóa vĩnh viễn nhóm quyền thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa vĩnh viễn nhóm quyền thất bại!"
        });
    };
};

//[PATCH] /api/admin/roles/trash/restore-multi
module.exports.restoreMulti = async (req, res) => {
    try {
        const { ids, key } = req.body;
        switch (key) {
            case 'restore':
                await Role.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: false
                });
                res.json({
                    code: 200,
                    message: "Khôi phục nhóm quyền thành công!"
                })
                break;
            case 'delete':
                await Role.deleteMany({
                    _id: { $in: ids }
                });

                res.json({
                    code: 200,
                    message: "Xóa vĩnh viễn nhóm quyền thành công!"
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Khôi phục/xóa nhóm quyền thất bại!"
                });
                break;
        };
    } catch (error) {
        res.json({
            code: 400,
            message: "Khôi phục/xóa nhóm quyền thất bại!"
        });
    };
};
