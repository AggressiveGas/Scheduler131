const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    joincode: {
        type: String,
        required: true,
        unique: true,
    },
    administrator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);