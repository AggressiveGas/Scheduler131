const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema({
    roomcode: {
        type: String,
        required: true,
    },
    day: {
        type: String,
        required: true
    },
    start: {
        type: Number
    },
    end: {
        type: Number
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Meeting', meetingSchema);