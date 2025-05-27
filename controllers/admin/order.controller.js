const Order = require("../../models/order.model");
const Account = require("../../models/account.model");
const Product = require("../../models/product.model");
// [GET] /api/admin/order
module.exports.index = async (req, res) => {
    try {
        const find = {
            deleted: false
        };

        const orders = await Order.find(find).lean();

        // await Promise.all(orders.map(async (order) => {
        //     const userInfo = await User.findOne({
        //         _id: order.user_id
        //     }).lean();
        //     if (userInfo) {
        //         order.userFullName = userInfo.fullName;
        //     }
        // }));

        // console.log(orders);

        return res.json({
            code: 200,
            message: "Lấy danh sách đơn hàng thành công!",
            orders: orders
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

