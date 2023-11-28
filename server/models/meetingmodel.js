const mongoose = require('mongoose')

const timeFormat = new mongoose.Schema({
    day: String,
    intervals: {start: Number, end: Number, _id: false}
}, { _id: false });

const meetingSchema = new mongoose.Schema({
    roomcode: {
        type: String,
        required: true,
        unique: true,
    },
    time: timeFormat
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Meeting', meetingSchema);