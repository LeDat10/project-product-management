const routesProduct = require("./product.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const userRoutes = require("./user.route");
const orderRoutes = require("./order.route");

const cartMiddleware = require("../../middlewares/client/cart.middleware");
const authenMiddeware = require("../../middlewares/client/authenticateToken.middleware");
const authorMiddleware = require("../../middlewares/client/author.middlware");


module.exports = (app) => {
    const version = "/api";

    app.use(version + "/products", routesProduct);

    app.use(version + "/search", searchRoutes);

    app.use(version + "/carts", authenMiddeware.authenticateToken, cartMiddleware.cartId, cartRoutes);

    app.use(version + "/users", userRoutes);

    app.use(version + "/order", authorMiddleware.requireAuth, orderRoutes);
};