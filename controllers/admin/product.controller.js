const { model } = require("mongoose");
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

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

        const products = await Product.find(find).sort(sort);

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

        await Product.updateOne({ _id: id }, { status: status });
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
            deletedAt: Date.now()

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
        switch (key) {
            case "active":
                await Product.updateMany({ _id: { $in: ids } }, {
                    status: "active"
                });

                res.json({
                    code: 200
                });
                break;
            case "inactive":
                await Product.updateMany({ _id: { $in: ids } }, {
                    status: "inactive"
                });

                res.json({
                    code: 200
                });
                break;
            case "position":
                for (const item of ids) {
                    let [id, position] = item.split("-");
                    if (id && position) {
                        await Product.updateOne({
                            _id: id
                        }, {
                            position: position
                        });
                    };
                };

                res.json({
                    code: 200
                });
                break;
            case "delete-all":
                await Product.updateMany({ _id: { $in: ids } }, {
                    deleted: true,
                    deletedAt: Date.now()
                });

                res.json({
                    code: 200
                });
                break;

            default:
                res.json({
                    code: 400
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400
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
        const product = Product(req.body);
        await product.save();

        res.json({
            code: 200
        });
    } catch (error) {
        res.json({
            code: 400
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

        // console.log(req.body);

        req.body.price = parseFloat(req.body.price);
        req.body.discountPercentage = parseFloat(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.position = parseInt(req.body.position);

        await Product.updateOne({
            _id: id
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