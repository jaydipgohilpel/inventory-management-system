const mongoose = require('mongoose');
const validator = require('validator');

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: function (value) {
                return value.length <= 30;
            },
            message: 'Product name must not exceed 30 characters',
        },
    },
    description: {
        type: String,
        trim: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true,
    },
    cost_price: {
        type: Number,
        required: true,

    },
    selling_price: {
        type: Number,
        required: true,
    },
    quantity_in_stock: {
        type: Number,
        required: true,
        default: 0,
    },
    reorder_point: {
        type: Number,
    },
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'supplier',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('products', productSchema);
