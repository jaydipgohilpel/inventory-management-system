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

})

module.exports = mongoose.model('users', userSchema)