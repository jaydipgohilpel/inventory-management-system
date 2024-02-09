const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    alert_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        default: mongoose.Types.ObjectId,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
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

module.exports = mongoose.model('Alert', alertSchema);
