const ProductCategory = require("../../models/product-category.model");

const convertToSlugHelper = require("../../helper/convertToSlug");

// [GET] /api/products-category
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


        const category = await ProductCategory.find(find).sort(sort).limit(objPagination.limit).skip(objPagination.skip);
        const totalCategory = await ProductCategory.countDocuments({
            deleted: false
        });

        res.json({
            code: 200,
            message: "Lấy danh sách sản phẩm thành công!",
            category: category,
            totalCategory: totalCategory
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy danh sách sản phẩm thất bại!",

        });
    };
};

// [PATCH] /api/products-category/create
module.exports.create = async (req, res) => {
    try {
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        } else {
            const count = await ProductCategory.countDocuments();
            req.body.position = count + 1;
        };

        const category = ProductCategory(req.body);
        await category.save();
        res.json({
            code: 200
        });
    } catch (error) {
        res.json({
            code: 400
        });
    };
};

// [PATCH] /api/products-category/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        await ProductCategory.updateOne({ _id: id }, { status: status });
        res.json({
            code: 200,
            message: "Cập nhật trạng thái danh mục thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái danh mục thất bại!"
        });
    }
};

// [PATCH] /api/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key } = req.body;
        switch (key) {
            case "active":
                await ProductCategory.updateMany({ _id: { $in: ids } }, {
                    status: "active"
                });

                res.json({
                    code: 200
                });
                break;
            case "inactive":
                await ProductCategory.updateMany({ _id: { $in: ids } }, {
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
                        await ProductCategory.updateOne({
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
                await ProductCategory.updateMany({ _id: { $in: ids } }, {
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

// [GET] /api/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const category = await ProductCategory.findOne({
            _id: id
        });

        res.json({
            code: 200,
            category: category
        });
    } catch (error) {
        res.json({
            code: 400
        });
    }
};

// [PATCH] /api/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        req.body.position = parseInt(req.body.position);

        await ProductCategory.updateOne({
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


// [DELETE] /api/products-category/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await ProductCategory.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: Date.now()

        });
        res.json({
            code: 200,
            message: "Xóa danh mục thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa danh mục thất bại!"
        });
    };
};

// [GET] /api/admin/products-category/trash
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

        const category = await ProductCategory.find(find).sort(sort).limit(objPagination.limit).skip(objPagination.skip);
        const totalCategory = await ProductCategory.countDocuments({
            deleted: true
        });

        res.json({
            code: 200,
            message: "Lấy danh mục sản phẩm thành công!",
            category: category,
            totalCategory: totalCategory
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy danh mục sản phẩm thất bại!"
        });
    };
};

//[PATCH] /api/admin/products-category/trash/restore
module.exports.restore = async (req, res) => {
    try {
        const categoryId = req.body.categoryId;
        await ProductCategory.updateOne({
            _id: categoryId
        }, {
            deleted: false
        });

        res.json({
            code: 200,
            message: "Khôi phục danh mục sản phẩm thành công!"
        });

    } catch (error) {
        res.json({
            code: 400,
            message: "Khôi phục danh mục sản phẩm thất bại!"
        });
    };
};

//[DELETE] /api/admin/products-category/trash/delete/:categoryId
module.exports.deletePermanently = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        await ProductCategory.deleteOne({ _id: categoryId });
        res.json({
            code: 200,
            message: "Xóa vĩnh viễn danh mục sản phẩm thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa vĩnh viễn danh mục sản phẩm thất bại!"
        });
    };
};

//[PATCH] /api/admin/products-category/trash/restore-multi
module.exports.restoreMulti = async (req, res) => {
    try {
        const { ids, key } = req.body;
        switch (key) {
            case 'restore':
                await ProductCategory.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: false
                });
                res.json({
                    code: 200,
                    message: "Khôi phục danh mục sản phẩm thành công!"
                })
                break;
            case 'delete':
                await ProductCategory.deleteMany({
                    _id: { $in: ids }
                });

                res.json({
                    code: 200,
                    message: "Xóa vĩnh viễn danh mục sản phẩm thành công!"
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Khôi phục/xóa danh mục sản phẩm thất bại!"
                });
                break;
        };
    } catch (error) {
        res.json({
            code: 400,
            message: "Khôi phục/xóa danh mục sản phẩm thất bại!"
        });
    };
};