const Order = require("../../models/order.model");
const Account = require("../../models/account.model");
const Product = require("../../models/product.model");
// [GET] /api/admin/order
module.exports.index = async (req, res) => {
    try {
        const find = {
            deleted: false
        };

        if (req.query.orderId) {
            find._id = req.query.orderId
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

        const orders = await Order.find(find).limit(objPagination.limit).skip(objPagination.skip).lean();
        const totalOrder = await Order.countDocuments({
            deleted: false
        });
        return res.json({
            code: 200,
            message: "Lấy danh sách đơn hàng thành công!",
            orders: orders,
            totalOrder: totalOrder
        });
    } catch (error) {
        return res.json({
            code: 400,
            message: "Lấy danh sách đơn hàng thất bại!"
        });
    };
};

// [PATCH] /api/order/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key } = req.body;

        const updatedBy = {
            account_id: req.account._id,
            updatedAt: new Date()
        };

        const validStatus = [
            "active",
            "inactive",
            "pending",
            "confirmed",
            "shipping",
            "delivered",
            "cancelled",
            "refunded"
        ];

        if (validStatus.includes(key)) {
            await Order.updateMany({ _id: { $in: ids } }, {
                status: key,
                $push: { updatedBy: updatedBy }
            });

            return res.json({
                code: 200,
                message: `Cập nhật trạng thái đơn hàng thành ${key} công!`
            });
        };

        switch (key) {
            case "delete-all":
                await Order.updateMany(
                    { _id: { $in: ids } },
                    {
                        deleted: true,
                        deletedBy: {
                            account_id: req.account._id,
                            deletedAt: new Date()
                        }
                    }
                );
                return res.json({
                    code: 200,
                    message: "Xóa nhiều đơn hàng thành công!"
                });
            default:
                return res.json({
                    code: 400,
                    message: "Cập nhật trạng thái đơn hàng thất bại!"
                });
        };
    } catch (error) {
        return res.json({
            code: 400,
            message: "Cập nhật trạng thái đơn hàng thất bại!"
        });
    };
};

// [GET] /api/order/detail/:orderId
module.exports.detail = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findOne({
            _id: orderId,
            deleted: false
        }).lean();

        if (order.products.length > 0) {
            for (const product of order.products) {
                const productInfo = await Product.findOne({
                    _id: product.product_id
                });
                product.titleProduct = productInfo.title;
                product.thumbnail = productInfo.thumbnail;
            };
        };

        if (order.updatedBy?.length) {
            for (const item of order.updatedBy) {
                const userUpdated = await Account.findOne({
                    _id: item.account_id
                }).lean();

                if (userUpdated) {
                    item.accountFullName = userUpdated.fullName;
                };
            };
        };

        return res.json({
            code: 200,
            message: "Lấy đơn hàng thành công!",
            order: order
        });
    } catch (error) {
        return res.json({
            code: 400,
            message: "Lấy đơn hàng thất bại!"
        });
    };
};

// [GET] /api/admin/order/trash
module.exports.trash = async (req, res) => {
    try {
        const find = {
            deleted: true
        };

        if (req.query.orderId) {
            find._id = req.query.orderId
        };

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

        const orders = await Order.find(find).limit(objPagination.limit).skip(objPagination.skip).lean();
        const totalOrder = await Order.countDocuments({
            deleted: true
        });
        return res.json({
            code: 200,
            message: "Lấy danh sách đơn hàng thành công!",
            orders: orders,
            totalOrder: totalOrder
        });
    } catch (error) {
        return res.json({
            code: 400,
            message: "Lấy danh sách đơn hàng thất bại!"
        });
    };
};

//[PATCH] /api/admin/order/trash/restore
module.exports.restore = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        await Order.updateOne({
            _id: orderId
        }, {
            deleted: false
        });

        res.json({
            code: 200,
            message: "Khôi phục đơn hàng thành công!"
        });

    } catch (error) {
        res.json({
            code: 400,
            message: "Khôi phục đơn hàng thất bại!"
        });
    };
};

//[DELETE] /api/admin/order/trash/delete/:orderId
module.exports.deletePermanently = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        await Order.deleteOne({ _id: orderId });
        res.json({
            code: 200,
            message: "Xóa vĩnh viễn đơn hàng thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa vĩnh viễn đơn hàng thất bại!"
        });
    };
};

//[PATCH] /api/admin/order/trash/restore-multi
module.exports.restoreMulti = async (req, res) => {
    try {
        const { ids, key } = req.body;
        switch (key) {
            case 'restore':
                await Order.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: false
                });
                res.json({
                    code: 200,
                    message: "Khôi phục đơn hàng thành công!"
                })
                break;
            case 'delete':
                await Order.deleteMany({
                    _id: { $in: ids }
                });

                res.json({
                    code: 200,
                    message: "Xóa vĩnh viễn đơn hàng thành công!"
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Khôi phục/xóa đơn hàng thất bại!"
                });
                break;
        };
    } catch (error) {
        res.json({
            code: 400,
            message: "Khôi phục/xóa đơn hàng thất bại!"
        });
    };
};