const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const orderRoutes = require("./order.route");
const userRoutes = require("./user.route");
const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
    const version = "/api/admin";

    app.use(version + "/products", authMiddleware.requireAuth, productRoutes);

    app.use(version + "/products-category", authMiddleware.requireAuth, productCategoryRoutes);

    app.use(version + "/roles", authMiddleware.requireAuth, roleRoutes);

    app.use(version + "/accounts", accountRoutes);

    app.use(version + "/order", authMiddleware.requireAuth, orderRoutes);

    app.use(version + "/user", authMiddleware.requireAuth, userRoutes);

}