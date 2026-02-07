const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true,
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// Ensure one log per habit per day
LogSchema.index({ habitId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Log', LogSchema);
