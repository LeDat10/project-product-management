const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    try {
        const statistic = {
            categoryProduct: {
                total: 0,
                active: 0,
                inactive: 0
            },
            product: {
                total: 0,
                active: 0,
                inactive: 0,
                featured: 0
            },
            account: {
                total: 0,
                active: 0,
                inactive: 0
            },
            user: {
                total: 0,
                active: 0,
                inactive: 0
            },
            // "pending", "confirmed", "shipping", "delivered", "cancelled", "refunded"
            order: {
                total: 0,
                payment: 0,
                noPayment: 0,
                pending: 0,
                confirmed: 0,
                shipping: 0,
                delivered: 0,
                cancelled: 0,
                refunded: 0
            }
        }

        statistic.categoryProduct.total = await ProductCategory.countDocuments({ deleted: false });
        statistic.categoryProduct.active = await ProductCategory.countDocuments({
            deleted: false,
            status: "active"
        });
        statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
            deleted: false,
            status: "inactive"
        });
        statistic.product.total = await Product.countDocuments({ deleted: false });
        statistic.product.active = await Product.countDocuments({
            deleted: false,
            status: "active"
        });
        statistic.product.inactive = await Product.countDocuments({
            deleted: false,
            status: "inactive"
        });
        statistic.product.featured = await Product.countDocuments({
            featured: "1"
        });

        statistic.account.total = await Account.countDocuments({ deleted: false });
        statistic.account.active = await Account.countDocuments({
            deleted: false,
            status: "active"
        });
        statistic.account.inactive = await Account.countDocuments({
            deleted: false,
            status: "inactive"
        });

        statistic.user.total = await User.countDocuments({ deleted: false });
        statistic.user.active = await User.countDocuments({
            deleted: false,
            status: "active"
        });
        statistic.user.inactive = await User.countDocuments({
            deleted: false,
            status: "inactive"
        });

        statistic.order.total = await Order.countDocuments({ deleted: false });

        statistic.order.payment = await Order.countDocuments({
            deleted: false,
            payment: true
        });

        statistic.order.noPayment = await Order.countDocuments({
            deleted: false,
            payment: false
        });

        statistic.order.confirmed = await Order.countDocuments({
            deleted: false,
            status: "confirmed"
        });

        statistic.order.pending = await Order.countDocuments({
            deleted: false,
            status: "pending"
        });

        statistic.order.shipping = await Order.countDocuments({
            deleted: false,
            status: "shipping"
        });

        statistic.order.refunded = await Order.countDocuments({
            deleted: false,
            status: "refunded"
        });

        statistic.order.delivered = await Order.countDocuments({
            deleted: false,
            status: "delivered"
        });

        statistic.order.cancelled = await Order.countDocuments({
            deleted: false,
            status: "cancelled"
        });

        res.json({
            code: 200,
            message: "Lấy số liệu thống kê thành công!",
            statistic: statistic
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy số liệu thống kê thất bại!",
        });
    };
};