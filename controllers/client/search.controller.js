const Product = require("../../models/product.model");
const convertToSlugHelper = require("../../helper/convertToSlug");
// [GET] /api/search
module.exports.index = async (req, res) => {
    let product = [];
    try {
        const keyword = req.query.keyword;
        if (keyword) {
            const keywordRegex = new RegExp(keyword, "i");
            const stringSlug = convertToSlugHelper.convertToSlug(keyword);
            const stringSlugRegex = new RegExp(stringSlug, "i");

            product = await Product.find({
                $or: [
                    { title: keywordRegex },
                    { slug: stringSlugRegex }
                ],
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