const asynchandler = require('express-async-handler')
const Availability = require('../models/availabilitymodel2');
const User = require('../models/usermodel');
const Room = require('../models/roommodel')

function findCommonMeetingTimes(availabilitylist) {
    const daysOfWeek = [];
    const users = [];

    const arrayPopulate = availability => {
        if(!(daysOfWeek.includes(availability.day))){
            daysOfWeek.push(availability.day);
        }
        if(!(users.includes((availability.user).toString()))){
            users.push((availability.user).toString());
        }
    }

    availabilitylist.forEach(arrayPopulate);

    //console.log(daysOfWeek); //for testing purposes
    //console.log(users);

    let schedule = {};
    daysOfWeek.forEach(day => (schedule[day] = Array(144).fill(0)));
    
    const markAvailability = userAvailability => {
        const day = userAvailability.day;
        userAvailability.intervals.forEach(interval => {
            // Use the interval values directly as they already represent 10-minute intervals
            let startInterval = interval.start;
            let endInterval = interval.end;
            for (
              let intervalIndex = startInterval;
              intervalIndex <= endInterval;
              intervalIndex++
            ) {
              schedule[day][intervalIndex]++;
            }
          });
      };
    
      availabilitylist.forEach(userAvailability => {
        markAvailability(userAvailability);
      });
    
      // Find common available times
      const numUsers = users.length;
      const commonTimes = {};
      Object.keys(schedule).forEach(day => {
            commonTimes[day] = schedule[day]
            .map((count, index) => (count === numUsers ? index : null))
            .filter(index => index !== null);
            if (commonTimes[day].length == 0)
                delete commonTimes[day];
      });
    
      return commonTimes;
};

const getCommonTimes = asynchandler(async (req, res) => {
    const room = await Room.findOne({joincode: req.params.joincode})   // gets all room data from the database

    if(!room){
        res.status(404)
        throw new Error('Room not found')
    }

    const userlist = room.userlist;
    const availabilitylist = [];

    for await (const availability of Availability.find()) {
        if(isOld(availability.day)){       //clears out availabilities that are old
            const deletedAvailability = await Availability.findByIdAndDelete(availability._id);
        }

        else if (userlist.includes(availability.user)) {
            availabilitylist.push(availability);
        }
    }

    //console.log(availabilitylist) // for testing purposes

    const commonTimes = findCommonMeetingTimes(availabilitylist);

    //console.log(commonTimes);  // for testing purposes

    // Send the availability data as a response
    res.status(200).json(commonTimes);
});

function isOld(date){
    const dateData = date.split("-");
    let month = dateData[0];
    let day = dateData[1];
    let year = dateData[2];
    
    const curDate = new Date();
    let curMonth = curDate.getMonth() + 1;
    let curDay = curDate.getDate();
    let curYear = curDate.getFullYear();

    if(year < curYear)
        return true;
    else if(year == curYear){
        if(month < curMonth)
            return true;
        else if(month == curMonth){
            if(day < curDay)
                return true;
        }
    }

    return false;
}

module.exports = {getCommonTimes};