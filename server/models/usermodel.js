const mongoose = require('mongoose')
const TOTAL_INTERVALS = 24 * 6

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
    },
    availability: {
        type: Array,
        default: () => Array(TOTAL_INTERVALS).fill(false),
    },
}, 
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);