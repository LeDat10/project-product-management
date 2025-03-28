const ProductCategory = require("../models/product-category.model");

module.exports.pricenewProducts = (products) => {
    const newProducts = products.map(item => {
        item.priceNew = parseFloat((item.price * (100 - item.discountPercentage) / 100).toFixed(2));
        return item;
    });

    return newProducts;
};

module.exports.pricenewProduct = (product) => {
    const priceNew = parseFloat((product.price * (100 - product.discountPercentage) / 100).toFixed(2));
    return priceNew;
}