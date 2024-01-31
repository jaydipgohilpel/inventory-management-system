const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        default: mongoose.Types.ObjectId,
    },
    order_date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered"],
        required: true,
    },
    order_detail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orderdetail',
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

module.exports = mongoose.model('Order', orderSchema);
