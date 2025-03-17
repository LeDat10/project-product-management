const ProductCategory = require("../../models/product-category.model");

// [GET] /api/products-category
module.exports.index = async(req, res) => {
    try {
        const productsCategory = await ProductCategory.find({
            deleted: false
        });

        res.json({
            code: 200,
            records: productsCategory
        });
    } catch (error) {
        res.json({
            code: 400
        });
    };
};

// [PATCH] /api/products-category/create
module.exports.create = async(req, res) => {
    try {
        res.json({
            code: 200
        });    
    } catch (error) {
        res.json({
            code: 400
        });
    };
};