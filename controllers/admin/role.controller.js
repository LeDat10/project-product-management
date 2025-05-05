const Role = require("../../models/role.model");

// [GET] /api/roles
module.exports.index = async (req, res) => {

    try {
        const roles = await Role.find({
            deleted: false
        });

        res.json({
            code: 200,
            roles: roles
        });
    } catch (error) {
        res.json({
            code: 400
        });
    }
};

// [post] /api/roles/create
module.exports.create = async (req, res) => {
    try {
        const role = Role(req.body);
        await role.save();
        res.json({
            code: 200
        });
    } catch (error) {
        res.json({
            code: 400
        });
    }
};

// [DELETE] /api/roles/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: Date.now()
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

        await Role.updateOne({
            _id: id,
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

// [GET] /api/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const role = await Role.findOne({
            _id: id,
            deleted: false
        });

        res.json({
            code: 200,
            role: role
        });
    } catch (error) {
        res.json({
            code: 400
        });
    }
};

// [PATCH] /api/roles/permissions
module.exports.permissions = async (req, res) => {
    try {
        const {id, permissions} = req.body;

        await Role.updateOne({
            _id: id
        }, {
            permissions: permissions
        });

        res.json({
            code: 200
        });
    } catch (error) {
        res.json({
            code: 400
        });
    };
};