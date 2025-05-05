const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

// [GET] /api/products
module.exports.index = async (req, res) => {
    try {
        const find = {
            deleted: false
        };

        // Search
        if (req.query.keyword) {
            const regex = new RegExp(req.query.keyword, "i");
            find.title = regex;
        }
        // End Search

        // Filter

        if (req.query.status) {
            find.status = req.query.status;
        }
        // End Filter

        // Sort
        const sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort.position = "desc";
        }
        // End sort

        // filter with category
        if (req.query.categoryId) {
            find.categoryId = req.query.categoryId;
        }
        // end filter with category

        const products = await Product.find(find).sort(sort).lean();

        for (const product of products) {
            // // Lấy ra thông tin người tạo
            // const user = await Account.findOne({
            //     _id: product.createdBy.account_id
            // }).lean();

            // console.log(user);

            // if (user) {
            //     product.accountFullName = user.fullName;
            // };

            // // Lấy ra thông tin người cập nhật gần nhất
            if (product.updatedBy) {
                const updatedBy = product.updatedBy[product.updatedBy.length - 1];
                const userUpdated = await Account.findOne({
                    _id: updatedBy.account_id
                }).lean();
                updatedBy.accountFullName = userUpdated.fullName;
                product.updatedBy = updatedBy;
            };
        };

        res.json({
            code: 200,
            products: products
        });
    } catch (error) {
        res.json({
            code: 400
        });
    }
};

// [PATCH] /api/products/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        const updatedBy = {
            account_id: req.account._id,
            updatedAt: new Date()
        };

        await Product.updateOne({ _id: id }, {
            status: status,
            $push: { updatedBy: updatedBy }
        });
        res.json({
            code: 200,
            message: "Cập nhật trạng thái sản phẩm thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái sản phẩm thất bại!"
        })
    }
};

// [DELETE] /api/products/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Product.updateOne({ _id: id }, {
            deleted: true,
            deletedBy: {
                account_id: req.account._id,
                deletedAt: new Date()
            }

        });
        res.json({
            code: 200,
            message: "Xóa sản phẩm thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa sản phẩm thất bại!"
        });
    };
};

// [PATCH] /api/products/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key } = req.body;

        const updatedBy = {
            account_id: req.account._id,
            updatedAt: new Date()
        };

        switch (key) {
            case "active":
                await Product.updateMany({ _id: { $in: ids } }, {
                    status: "active",
                    $push: { updatedBy: updatedBy }
                });

                res.json({
                    code: 200,
                    message: "Thay đổi trạng thái sản phẩm thành công!"
                });
                break;
            case "inactive":
                await Product.updateMany({ _id: { $in: ids } }, {
                    status: "inactive",
                    $push: { updatedBy: updatedBy }
                });

                res.json({
                    code: 200,
                    message: "Thay đổi trạng thái hoạt động thành công!"
                });
                break;
            case "position":
                for (const item of ids) {
                    let [id, position] = item.split("-");
                    if (id && position) {
                        await Product.updateOne({
                            _id: id
                        }, {
                            position: position,
                            $push: { updatedBy: updatedBy }
                        });
                    };
                };

                res.json({
                    code: 200,
                    message: "Cập nhật vị trí sản phẩm thành công!"
                });
                break;
            case "delete-all":
                await Product.updateMany({ _id: { $in: ids } }, {
                    deleted: true,
                    deletedBy: {
                        account_id: req.account._id,
                        deletedAt: new Date()
                    }
                });

                res.json({
                    code: 200,
                    message: "Xóa nhiều sản phẩm thành công!"
                });
                break;

            default:
                res.json({
                    code: 400,
                    message: "Cập nhật trạng thái sản phẩm thất bại!"
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái sản phẩm thất bại!"
        });
    }
};

// [POST] /api/products/create
module.exports.create = async (req, res) => {
    try {
        req.body.price = parseFloat(req.body.price);
        req.body.discountPercentage = parseFloat(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        } else {
            const count = await Product.countDocuments();
            req.body.position = count + 1;
        };

        req.body.createdBy = {
            account_id: res.account._id
        };

        const product = Product(req.body);
        await product.save();

        res.json({
            code: 200,
            message: "Tạo sản phẩm mới thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo sản phẩm mới thất bại!"
        });
    }
};

// [GET] /api/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findOne({
            _id: id
        }).lean();

        if (product.categoryId) {
            const category = await ProductCategory.findOne({
                _id: product.categoryId,
                deleted: false
            });

            if (category) {
                product["categoryTitle"] = category.title
            }
        };
        res.json({
            code: 200,
            product: product
        });
    } catch (error) {
        res.json({
            code: 400
        });
    }
};

// [PATCH] /api/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const updatedBy = {
            account_id: req.account._id,
            updatedAt: new Date()
        };


        req.body.price = parseFloat(req.body.price);
        req.body.discountPercentage = parseFloat(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.position = parseInt(req.body.position);

        await Product.updateOne({
            _id: id
        }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        });

        res.json({
            code: 200,
            message: "Chỉnh sửa sản phẩm thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Chỉnh sửa sản phẩm thất bại!"
        });
    };
};