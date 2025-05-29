const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const convertToSlugHelper = require("../../helper/convertToSlug");

// [GET] /api/products
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

        const products = await Product.find(find).sort(sort).limit(objPagination.limit).skip(objPagination.skip).lean();
        const totalProduct = await Product.countDocuments({
            deleted: false
        });

        await Promise.all(products.map(async (product) => {
            if (product.updatedBy?.length) {
                const updatedBy = product.updatedBy[product.updatedBy.length - 1];
                const userUpdated = await Account.findOne({
                    _id: updatedBy.account_id
                }).lean();

                if (userUpdated) {
                    updatedBy.accountFullName = userUpdated.fullName;
                }

                product.updatedBy = updatedBy;
            }
        }));

        res.json({
            code: 200,
            message: "Lấy danh sách sản phẩm thành công!",
            products: products,
            totalProduct: totalProduct
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy danh sách sản phẩm thất bại!"
        });
    };
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
        console.log(req.body);
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
            account_id: req.account._id
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

        if (product.updatedBy?.length) {
            for (const item of product.updatedBy) {
                const userUpdated = await Account.findOne({
                    _id: item.account_id
                }).lean();

                if (userUpdated) {
                    item.accountFullName = userUpdated.fullName;
                };
            };
        };

        if (product.createdBy) {
            const userCreated = await Account.findOne({
                _id: product.createdBy.account_id
            }).lean();

            if (userCreated) {
                product.createdBy.accountFullName = userCreated.fullName;
            };
        };

        if (product.deletedBy) {
            const userDeleted = await Account.findOne({
                _id: product.deletedBy.account_id
            }).lean();

            if (userDeleted) {
                product.deletedBy.accountFullName = userDeleted.fullName;
            };
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


// [GET] /api/admin/products/trash
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

        const products = await Product.find(find).sort(sort).limit(objPagination.limit).skip(objPagination.skip);
        const totalProduct = await Product.countDocuments({
            deleted: true
        });

        res.json({
            code: 200,
            message: "Lấy sản phẩm thành công!",
            products: products,
            totalProduct: totalProduct
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy sản phẩm thất bại!"
        });
    };
};

//[PATCH] /api/admin/products/trash/restore
module.exports.restore = async (req, res) => {
    try {
        const productId = req.body.productId;
        await Product.updateOne({
            _id: productId
        }, {
            deleted: false
        });

        res.json({
            code: 200,
            message: "Khôi phục sản phẩm thành công!"
        });

    } catch (error) {
        res.json({
            code: 400,
            message: "Khôi phục sản phẩm thất bại!"
        });
    };
};

//[DELETE] /api/admin/products/trash/delete/:productId
module.exports.deletePermanently = async (req, res) => {
    try {
        const productId = req.params.productId;
        await Product.deleteOne({ _id: productId });
        res.json({
            code: 200,
            message: "Xóa vĩnh viễn sản phẩm thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa vĩnh viễn sản phẩm thất bại!"
        });
    };
};

//[PATCH] /api/admin/products/trash/restore-multi
module.exports.restoreMulti = async (req, res) => {
    try {
        const { ids, key } = req.body;
        switch (key) {
            case 'restore':
                await Product.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: false
                });
                res.json({
                    code: 200,
                    message: "Khôi phục sản phẩm thành công!"
                })
                break;
            case 'delete':
                await Product.deleteMany({
                    _id: { $in: ids }
                });

                res.json({
                    code: 200,
                    message: "Xóa vĩnh viễn sản phẩm thành công!"
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Khôi phục/xóa sản phẩm thất bại!"
                });
                break;
        };
    } catch (error) {
        res.json({
            code: 400,
            message: "Khôi phục/xóa sản phẩm thất bại!"
        });
    };
};


// [GET] /api/admin/products/category
module.exports.getCategory = async (req, res) => {
    try {
        const category = await ProductCategory.find({
            deleted: false,
            status: "active"
        }).select("title").sort({
            position: "desc"
        });

        res.json({
            code: 200,
            message: "Lấy danh mục sản phẩm thành công!",
            category: category
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy danh mục sản phẩm thất bại!",
        });
    };
};
