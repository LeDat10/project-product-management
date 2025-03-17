const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");

module.exports = (app) => {
    const version = "/api";

    app.use(version + "/products", productRoutes);

    app.use(version + "/products-category", productCategoryRoutes);
}