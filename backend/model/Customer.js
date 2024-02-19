const mongoose = require('mongoose');
const validator = require('validator');

const customerSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    phone_number: {
        type: String,
        unique: true,
        required: true,
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

module.exports = mongoose.model('Customer', customerSchema);
