const mongoose = require('mongoose');
const validator = require('validator');

const supplierSchema = new mongoose.Schema({
    supplier_name: {
        type: String,
        required: true,
    },
    contact_person: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    address: {
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

module.exports = mongoose.model('Supplier', supplierSchema);
