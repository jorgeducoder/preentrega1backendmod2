import mongoose from "mongoose";

const productCollection = "products";

const productSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    portions: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    thumbnails: {
        type: String,
        require: false,
        default: ""
    },
    stock: {
        type: Number,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: false,
        default: true
    },
    code: {
        type: String,
        require: true
    }
});

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;