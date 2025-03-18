const ProductCategory = require("../../models/product-category.model");

// [GET] /api/products-category
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

        const category = await ProductCategory.find(find).sort(sort);

        res.json({
            code: 200,
            category: category
        });
    } catch (error) {
        res.json({
            code: 400
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
            code: 200
        });
    } catch (error) {
        res.json({
            code: 400
        });
    }
};

// [PATCH] /api/products/change-multi
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