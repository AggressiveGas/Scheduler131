const mongoose = require('mongoose')

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
    roomlist: {
        type: Array,
        required: true
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);