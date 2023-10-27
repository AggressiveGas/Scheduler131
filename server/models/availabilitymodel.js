const mongoose = require('mongoose');

const dailyAvailabilitySchema = new mongoose.Schema({
    day: String,
    intervals: [{ start: Number, end: Number, _id: false }]
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    label: {
        type: String,
        required: true
    },
    weeklyAvailability: [dailyAvailabilitySchema]
});



module.exports = mongoose.model('Availability', availabilitySchema);
