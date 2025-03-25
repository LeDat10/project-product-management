const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
    {
        title: String,
        categoryId: {
            type: String,
            default: ""
        },
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        status: String,
        position: Number,
        thumbnail: String,
        featured: String,
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema, "products");
module.exports = Product;