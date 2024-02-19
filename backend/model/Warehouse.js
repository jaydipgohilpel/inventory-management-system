const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    warehouse_name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
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

module.exports = mongoose.model('Warehouse', warehouseSchema);
