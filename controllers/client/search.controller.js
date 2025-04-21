const Product = require("../../models/product.model");
// [GET] /api/search
module.exports.index = async (req, res) => {
    let product = [];
    try {
        const keyword = req.query.keyword;
        if (keyword) {
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

            product = await Product.find({
                title: keywordRegex,
                deleted: false,
                status: "active"
            }).select("title description price stock discountPercentage status thumbnail featured");
            
            res.json({
                code: 200,
                message: "Tìm kiếm sản phẩm thành công!",
                product: product
            });
        } else {
            res.json({
                code: 200,
                message: "Không tìm thấy sản phẩm nào!"
            });
        };
    } catch (error) {
        res.json({
            code: 400
        });
    };
};