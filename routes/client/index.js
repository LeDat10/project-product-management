const routesProduct = require("./product.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const userRoutes = require("./user.route");

const cartMiddleware = require("../../middlewares/client/cart.middleware");

module.exports = (app) => {
    const version = "/api";

    app.use(version + "/products", routesProduct);

    app.use(version + "/search", searchRoutes);

    app.use(version + "/carts", cartMiddleware.cartId, cartRoutes);

    app.use(version + "/users", userRoutes);
};