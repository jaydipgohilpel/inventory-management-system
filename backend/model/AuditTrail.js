const mongoose = require('mongoose');

const auditTrailSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        enum: ["Create", "Update", "Delete"],
        required: true,
    },
    table_name: {
        type: String,
        required: true,
    },
    record_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
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

module.exports = mongoose.model('AuditTrail', auditTrailSchema);
