const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    day: {
        type: String,
        required: true
    },
    intervals: [{ start: Number, end: Number, _id: false }]
});

module.exports = mongoose.model('Availability2', availabilitySchema);
