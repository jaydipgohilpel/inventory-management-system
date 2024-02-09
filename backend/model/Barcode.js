const mongoose = require('mongoose');

const barcodeSchema = new mongoose.Schema({
    barcode_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        default: mongoose.Types.ObjectId,
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    barcode_value: {
        type: String,
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

module.exports = mongoose.model('Barcode', barcodeSchema);
