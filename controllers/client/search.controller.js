const Product = require("../../models/product.model");
// [GET] /api/search
module.exports.index = async (req, res) => {
    let product = [];
    try {
        const keyword = req.query.keyword;
        if(keyword) {
            const keywordRegex = new RegExp(keyword, "i");
            product = await Product.find({
                title: keywordRegex,
                deleted: false,
                status: "active"
            }).select("title description price stock discountPercentage status thumbnail featured");
        };

        res.json({
            code: 200,
            message: "Tìm kiếm sản phẩm thành công!",
            product: product
        })
    } catch (error) {
        res.json({
            code: 400
        });
    };
};