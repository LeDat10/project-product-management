const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productHelper = require("../../helper/product");

// [GET] /api/products
module.exports.index = async (req, res) => {
    try {
        const find = {
            deleted: false,
            status: "active"
        };

        const products = await Product.find(find).sort({
            position: "desc"
        }).select("title description price discountPercentage stock thumbnail featured slug categoryId").lean();

        for (const product of products) {
            if(product.categoryId) {
                const category = await ProductCategory.findOne({
                    _id: product.categoryId,
                    deleted: false,
                    status: "active"
                }).select("title").lean();

                if(category) {
                    product.categoryTitle = category.title;
                };
            }
        }

        const newProducts = productHelper.pricenewProducts(products);

        res.json({
            code: 200,
            products: newProducts
        });
    } catch (error) {
        res.json({
            code: 400
        });
    }
};

//[GET] /api/products/:slugCategory
module.exports.category = async(req, res) => {
    try {
        const slugCategory = req.params.slugCategory;
        const category = await ProductCategory.findOne({
            slug: slugCategory,
            deleted: false,
            status: "active"
        });

        if(!category) {
            res.json({
                code: 200,
                message: "Không có sản phẩm nào trong danh mục này!"
            });
            return;
        } 

        const products = await Product.find({
            categoryId: category.id,
            deleted: false,
            status: "active"
        }).select("title description price discountPercentage stock thumbnail featured slug categoryId").sort({position: "desc"}).lean();

        for (const product of products) {
            product.categoryTitle = category.title
        }

        const newProducts = productHelper.pricenewProducts(products);
    

        res.json({
            code: 200,
            message: "Lấy sản phẩm trong danh mục thành công!",
            products: newProducts,
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy sản phẩm trong danh mục thất bại!"
        });
    }
};

//[GET] /api/products/detail/:slugProduct
module.exports.detail = async(req, res) => {
    try {
        const slugProduct = req.params.slugProduct;

        const product = await Product.findOne({
            slug: slugProduct,
            deleted: false,
            status: "active"
        }).select("title description price discountPercentage stock thumbnail featured slug categoryId").lean();

        if(product.categoryId) {
            const category = await ProductCategory.findOne({
                _id: product.categoryId,
                deleted: false,
                status: "active"
            });
            product.categoryTitle = category.title;
        }

        res.json({
            code: 200,
            message: "Lấy sản phẩm thành công!",
            product: product
        });
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy sản phẩm thất bại!"
        })
    }
};


//[GET] /api/products/featured
module.exports.featured = async(req, res) => {
    try {
        const productsFeatured = await Product.find({
            deleted: false,
            featured: "1",
            status: "active"
        }).limit(6).sort({
            position: "desc"
        }).select("title description price discountPercentage stock thumbnail featured slug categoryId").lean();

        for (const product of productsFeatured) {
            if(product.categoryId) {
                const category = await ProductCategory.findOne({
                    _id: product.categoryId,
                    deleted: false,
                    status: "active"
                }).select("title").lean();

                if(category) {
                    product.categoryTitle = category.title;
                };
            }
        }

        const newProducts = productHelper.pricenewProducts(productsFeatured);

        res.json({
            code: 200,
            message: "Lấy sản phẩm thành công!",
            product: newProducts
        });
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy sản phẩm thất bại!"
        })
    }
};

//[GET] /api/products/listNewProducts
module.exports.listNewProducts = async(req, res) => {
    try {
        const products = await Product.find({
            deleted: false,
            status: "active"
        }).limit(6).sort({
            position: "desc"
        }).select("title description price discountPercentage stock thumbnail featured slug categoryId").lean();

        for (const product of products) {
            if(product.categoryId) {
                const category = await ProductCategory.findOne({
                    _id: product.categoryId,
                    deleted: false,
                    status: "active"
                }).select("title").lean();

                if(category) {
                    product.categoryTitle = category.title;
                };
            }
        }

        const newProducts = productHelper.pricenewProducts(products);

        res.json({
            code: 200,
            message: "Lấy sản phẩm thành công!",
            product: newProducts
        });
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy sản phẩm thất bại!"
        });
    };
};