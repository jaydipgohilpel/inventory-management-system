const mongoose = require('mongoose')
const validator = require('validator');
const { UserRoles } = require('../enum/enums');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    password: {
        type: String,
        minlength: [8, 'Password must be at least 8 characters long'],
        required: true
    },
    role: {
        type: String,
        enum: Object.values(UserRoles),
        default: UserRoles.BASIC_USER,
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
})

module.exports = mongoose.model('Users', userSchema)