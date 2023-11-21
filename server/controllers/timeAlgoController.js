const asynchandler = require('express-async-handler')
const Availability = require('../models/availabilitymodel');
const User = require('../models/usermodel');
const Room = require('../models/roommodel')

function findCommonMeetingTimes(availabilityData) {
    const daysOfWeek = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    let weeklySchedule = {};
    daysOfWeek.forEach(day => (weeklySchedule[day] = Array(144).fill(0)));
  
    const markAvailability = weeklyAvailability => {
      weeklyAvailability.forEach(dayInfo => {
        const day = dayInfo.day;
        dayInfo.intervals.forEach(interval => {
          // Use the interval values directly as they already represent 10-minute intervals
          let startInterval = interval.start;
          let endInterval = interval.end;
          for (
            let intervalIndex = startInterval;
            intervalIndex < endInterval;
            intervalIndex++
          ) {
            weeklySchedule[day][intervalIndex]++;
          }
        });
      });
    };
  
    availabilityData.forEach(userAvailability => {
      markAvailability(userAvailability.weeklyAvailability);
    });
  
    // Find common available times
    const numUsers = availabilityData.length;
    const commonTimes = {};
    Object.keys(weeklySchedule).forEach(day => {
      commonTimes[day] = weeklySchedule[day]
        .map((count, index) => (count === numUsers ? index : null))
        .filter(index => index !== null);
    });
  
    return commonTimes;
  }

const getCommonTimes = asynchandler(async (req, res) => {
    const room = await Room.findOne({joincode: req.params.joincode})   // gets all room data from the database

    if(!room){
        res.status(404)
        throw new Error('Room not found')
    }

    const userlist = room.userlist
    const availabilitylist = []

    for (let i = 0; i < userlist.length; i++) {   // works even if the user changes their availability since it references though the user id and not the avail id
        const availability = await Availability.findOne({user: userlist[i]}).select('weeklyAvailability')
        availabilitylist.push(availability)
    }

    console.log(availabilitylist) // for testing purposes

    const commonTimes = findCommonMeetingTimes(availabilitylist);

    //console.log(commonTimes);  // for testing purposes

    // Send the availability data as a response
    res.status(200).json(commonTimes);
});


module.exports = {getCommonTimes};
