import React, { useRef, useState, useEffect } from 'react';
import TimezoneSelect from "react-timezone-select";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; //going to be used to calls like on any other form {personally I like axios}
import './RoomStyling.css';
import DateTimePicker from 'react-tailwindcss-datetimepicker';
import moment from 'moment-timezone';
import { Input, Popover, PopoverHandler, PopoverContent} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Timepicker, initTE } from "tw-elements";



//Pop-ups that the user would see(the UI setup for rooms)
const Room = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showAvailabilityPopup, setShowAvailabilityPopup] = useState(false);
  const [selectedtimezone, setSelectedTimezone] = useState(''); //holds the entered timezone
  const [roomCode, setRoomCode] = useState(''); //holds the entered room code
  const [roomName, setRoomName] = useState(''); //holds the entered room name
  const [userRooms, setUserRooms] = useState([]);//will hold list of rooms user is associated with
  const [selectedRoom, setSelectedRoom] = useState(null); //will hold selected rooms on ui
  const navigate = useNavigate();
  const [date, setDate] = React.useState(new Date());
  const [from, setFrom] = useState("0");
  const [to, setTo] = useState("0");
  const [commonAvailability, setCommonAvailability] = useState(null); //holds common availability
  const [showCreateMeetingPopup, setShowCreateMeetingPopup] = useState(false);
  const [meetingDate, setMeetingDate] = useState(new Date());

  

  
  //trying to split the date so that it can later be used for comparisons
  const SplitDate = (defaultValue) => {
    const arrayDate = defaultValue.toLocaleDateString().split("/");
    console.log(defaultValue);
  }
 
  const handleAddClick = () => {
    setShowPopup(true);
  };


  const handleAddRoom = () => {
    setShowPopup(false); // Close the main popup after clicking add --SideNote: I did this because don't want multiple windows show up and making it confusing for the user
    setShowAddPopup(true); // Show the "Add" popup
  };


  const handleCreateRoom = () => {
    setShowPopup(false); // Close the main popup after clicking create --SideNote: I did this because don't want multiple windows show up and making it confusing for the user
    setShowCreatePopup(true); // Show the "Create" popup
  };


  const handleAvailability = () => {
    setShowPopup(false); // Close the main popup after clicking create --SideNote: I did this because don't want multiple windows show up and making it confusing for the user
    setShowAvailabilityPopup(true); // Show the "Availability" popup
    setSelectedRoom(false);
    
  };


  const handleClosePopup = () => {
    setShowPopup(false);
    setShowAddPopup(false);
    setShowCreatePopup(false);
    setShowAvailabilityPopup(false);
  };




  const handlePreviousPagePopup = () => {
    //setSelectedRoom(true);
    setShowAvailabilityPopup(false);
  }

//when user clicks room shows them the next step
  const handleRoomClick = async (room) => {
    setSelectedRoom(room);
  };
  

//functionalities for creating and joining rooms:
//Function to create a new room
const createRoomApiCall = async (roomName) => {


  //Since token is stored locally, gonna need to grab it for authorization otherwise can't make or join rooms
  try {
    const userTokenHere = localStorage.getItem("authToken");


    const response = await axios.post('http://localhost:8080/api/rooms', { name: roomName }, {
      headers: {
        Authorization: `Bearer ${userTokenHere}`,
      },
    });


    //console log for success
    console.log('Room created successfully:', response.data);
  } catch (error) {
    //console log for error
    console.error('Error creating room:', error.response.data.message);
  }
};


// Function to join a room
const joinRoomApiCall = async (roomCode) => {


  //Since token is stored locally, gonna need to grab it for authorization otherwise can't make or join rooms


  try {
    const userTokenHere = localStorage.getItem("authToken");


    const response = await axios.post(`http://localhost:8080/api/rooms/${roomCode}/users`, null, {
      headers: {
        Authorization: `Bearer ${userTokenHere}`,
      },
    });


    //console log for success
    console.log('Joined room successfully:', response.data);
  } catch (error) {
    //console log for error
    console.error('Error joining room:', error.response.data.message);
  }
};




//this here will get the users rooms that they joined or created.
useEffect(() => {
  const fetchUserRooms = async () => {
    try {
     
      const userId = localStorage.getItem("userId");
      const userTokenHere = localStorage.getItem("authToken");
      const response = await axios.get(`http://localhost:8080/api/user/${userId}/rooms`, {
        headers: {
          Authorization: `Bearer ${userTokenHere}`,
        },
      });


      const roomsWithUserDetails = await Promise.all(
        response.data.map(async (room) => {
          const userDetailsList = await Promise.all(
            room.userlist.map(async (userId) => {
              const userResponse = await axios.get(`http://localhost:8080/api/user/${userId}`);
              return userResponse.data;
            })
          );
          return { ...room, userDetailsList };
        })
      );


      setUserRooms(roomsWithUserDetails || []);
    } catch (error) {
      console.error('Error fetching user rooms:', error.response.data.message);
    }
  };


  fetchUserRooms();
}, []);




//instead of grabbing user ID I need their names which will be displayed in room details after
const fetchUserDetails = async (userId) => {
  try {
    const userTokenHere = localStorage.getItem("authToken");
    const response = await axios.get(`http://localhost:8080/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${userTokenHere}`,
      },
    });


    return response.data; // Assuming the user details are returned in the response
  } catch (error) {
    console.error('Error fetching user details:', error.response.data.message);
    return null;
  }
};


//for the DATETIMEPICKER UI
const now = new Date();
  const start = moment(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  );
  const end = moment(start).add(1, 'days').subtract(1, 'seconds');
  const [range, setRange] = useState({
    start: start,
    end: end,
  });
  const ranges = {
    Today: [moment(start), moment(end)],
   
  };
  const local = {
    format: 'DD-MM-YYYY HH:mm',
    sundayFirst: false,
  };
  const maxDate = moment(start).add(30, 'month');


  function handleApply(startDate, endDate) {
    setRange({ start: startDate, end: endDate });
  }




// Function to generate an array of time slots with 10-minute intervals starting from 12:00 PM
const generateTimeSlots = () => {
  /*old one*/
  /*const startTime = moment().startOf('day').add(12, 'hours'); // Start from 12:00 PM*/
  
  const startTime = moment().startOf('day'); // Start from 12:00 AM (midnight)
  const timeSlots = [];

  // Loop to generate 144 time slots (10-minute intervals for 24 hours)
  for (let i = 0; i < 144; i++) {
      // Calculate the time for each slot and format it as 'hh:mm A'
      const time = startTime.clone().add(i * 10, 'minutes').format('hh:mm A');
      timeSlots.push(time);
  }

  return timeSlots;
};
 
// Function to convert a time string to the number of 10-minute intervals from midnight
const timeToIntervals = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
// Calculate the total number of intervals using the formula: hours * 6 + Math.floor(minutes / 10) math make brain hurt btw
  return hours * 6 + Math.floor(minutes / 10);
};


const handleAvailabilitySubmit = async () => {
  try {
    //DATE FORMATTING AND STUFFS OK
    const day = format(date, "MM-dd-yyyy");
    const startTime = moment(from, ["h:mm A"]).format("HH:mm");
    const endTime = moment(to, ["h:mm A"]).format("HH:mm");
    const startIntervals = timeToIntervals(startTime);
    const endIntervals = timeToIntervals(endTime);

    const availabilityData = {
      day: day,
      intervals: [
        {
          start: startIntervals,
          end: endIntervals
        }
      ]
    };

    console.log('Availability Payload:', availabilityData); 

    //grab userid and token
    const userTokenHere = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    //I STRUGGLED WITH THIS POST for some reason its /user/id even though its not in availabilityroutes.js
    const response = await axios.post(
      `http://localhost:8080/api/user/${userId}/availability`,
      availabilityData,
      {
        headers: {
          Authorization: `Bearer ${userTokenHere}`,
          'Content-Type': 'application/json'
        }
      }
    );

    //just logs to let know if post went through or not
    console.log('Availability submitted successfully:', response.data);
  } catch (error) {
    console.error('Error submitting availability:', error.message);
  }
};


const handleCreateMeeting = () => {
  setShowPopup(false);
  setShowCreateMeetingPopup(true);
  setMeetingDate(new Date());
};

const handleCreateMeetingSubmit = async () => {
  try {
    // DATE FORMATTING AND STUFFS OK
    const day = format(date, "MM-dd-yyyy");
    const startTime = moment(from, ["h:mm A"]).format("HH:mm");
    const endTime = moment(to, ["h:mm A"]).format("HH:mm");
    const startIntervals = timeToIntervals(startTime);
    const endIntervals = timeToIntervals(endTime);

    // Pass selectedRoom directly to the function
    const room = selectedRoom;

    const meetingData = {
      roomcode: room.joincode,
      day: day,
      start: startIntervals,
      end: endIntervals,
    };

    console.log('Meeting Payload:', meetingData);

    // grab userid and token
    const userTokenHere = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    const response = await axios.post(
      `http://localhost:8080/api/meetings/${room.joincode}`,
      meetingData,
      {
        headers: {
          Authorization: `Bearer ${userTokenHere}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // just logs to let know if post went through or not
    console.log('Meeting submitted successfully:', response.data);
  } catch (error) {
    console.error('Error submitting meeting:', error.message);
  }
};




  // Function to fetch and set common availability
  const fetchCommonAvailability = async (room) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/timeslots/${room.joincode}`);
      const commonAvailability = response.data;

      // Set the common availability in the state
      setCommonAvailability(commonAvailability);

      console.log('Common Availability:', commonAvailability);
    } catch (error) {
      console.error('Error fetching common availability:', error.response.data.message);
    }
  };



 
//everything below is formatting/buttons/inputs for the pop up forms.
  return (  
<div className="container flex flex-wrap items-start justify-start h-screen px-9 py-12 relative">
    {/* +add room button */}
    <button
      className={`room-button ${selectedRoom ? 'selected-room' : 'add-room-button'}`}
      onClick={handleAddClick}
    >
      <span className="mr-2 text-4xl">+</span>
      Add Room
    </button>


    {/* Render clickable room buttons */}
    {userRooms.map((room) => (
        <button
          key={room.id}
          className="room-button"
          onClick={() => handleRoomClick(room)}
        >
          {room.name}
        </button>
    ))}




{selectedRoom && (
        // Overlay for Room Details
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0">
          <div className="bg-white p-8 rounded-lg shadow-md relative w-80 flex flex-col items-center border border-gray-300">
            <button
              className="text-red-600 hover:text-red-800 absolute top-0 right-2"
              onClick={() => setSelectedRoom(null)}
            >
              <span className="text-2xl font-bold">&times;</span>
            </button>


            <p className="text-lg font-semibold mb-4">Room Details</p>


            <p>Room Name: {selectedRoom.name}</p>
            <p>Join Code: {selectedRoom.joincode}</p>


            <p>
              Users:{' '}
              {selectedRoom.userDetailsList.map((user, index) => (
                <span key={user.id}>
                  {user.name}
                  {index !== selectedRoom.userDetailsList.length - 1 && ', '}
                </span>
              ))}
            </p>

          {/* Button to create a meeting*/}
          <button
              className="block rounded-lg px-3 py-2 mt-2 text-sm font-semibold leading-6 text-gray-900 bg-gray-100 hover:bg-gray-300 w-full"
              onClick={handleAvailability}
            >  
              Add your Availability
            </button>
          {/* Button to create a meeting*/}
            <button
              className="block rounded-lg px-3 py-2 mt-2 text-sm font-semibold leading-6 text-gray-900 bg-gray-100 hover:bg-gray-300 w-full"
              onClick={handleCreateMeeting}
            >  
              Schedule Meeting
            </button>
            {/* Button to fetch and show common availability */}
            <button
              className="block rounded-lg px-3 py-2 mt-2 text-sm font-semibold leading-6 text-gray-900 bg-gray-100 hover:bg-gray-300 w-full"
              onClick={() => fetchCommonAvailability(selectedRoom)}
            >  
              Show Common Availability
            </button>
            <p className=""> ________________________________________</p>
            <p className="pb-2 font-bold">Common Availability:</p>
            {/* Display common availability if available */}
              {commonAvailability && (
                <div className="mt-4 overflow-y-auto max-h-40 text-center">
                  {/* Loop through the days and display common availability for each day */}
                    {Object.keys(commonAvailability).map((day) => (
                      <div key={day} className="mb-4">
                        <p className="font-bold">{day}</p>
                        <div className="flex flex-wrap justify-center">
                          {commonAvailability[day].map((interval) => (
                            <div key={interval} className="mx-2 my-1">
                              {/* Convert interval back to the proper time and display */}
                              {generateTimeSlots()[interval]}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md relative w-80 flex flex-col items-center border border-gray-300">
            <button
            //this here is the red x button which will close the popup
              className="text-red-600 hover:text-red-800 absolute top-0 right-2"
              onClick={handleClosePopup}
            >
              <span className="text-2xl font-bold">&times;</span>
            </button>


            <button
            //this is the blue "add" button above the "OR" statement
              className="bg-blue-500 hover:bg-blue-700 text-white px-10 py-2 rounded mb-2"
              onClick={handleAddRoom}
            >
              Add
            </button>


            <p className="text-lg font-semibold my-2">OR</p>


            <button
            //this is the green "create" button below  the "OR" statement
              className="bg-green-500 hover:bg-green-700 text-white px-8 py-2 rounded mb-2"
              onClick={handleCreateRoom}
            >
              Create
            </button>
          </div>
        </div>
      )}


{/*Below is the Add a new room popup box alongside its formatting*/}
      {showAddPopup && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md relative w-80 flex flex-col items-center border border-gray-300">
            <button
              className="text-red-600 hover:text-red-800 absolute top-0 right-2"
              onClick={handleClosePopup}
            >
              <span className="text-2xl font-bold">&times;</span>
            </button>


            <p className="text-lg font-semibold mb-4">Enter a code to join a room</p>


            {/* Input textbox for entering room code */}
            <input
              type="text"
              className="border border-gray-400 px-3 py-2 rounded w-full"
              placeholder="Enter code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />


             {/* Join Room button after they put in their code*/}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white px-8 py-2 rounded mt-4"
              onClick={() => {
                // Add logic for joining a room
                joinRoomApiCall(roomCode); //pass the user's input value to the call
       
                setShowAddPopup(false);
                
              }}
            >
              Join Room
            </button>
          </div>
        </div>
      )}


{/*Below is the Create a new room popup box alongside its formatting*/}
      {showCreatePopup && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md relative w-80 flex flex-col items-center border border-gray-300">
            <button
              className="text-red-600 hover:text-red-800 absolute top-0 right-2"
              onClick={handleClosePopup}
            >
              <span className="text-2xl font-bold">&times;</span>
            </button>


            <p className="text-lg font-semibold mb-4">Create a new room</p>


            {/* Input textbox for creating a new room-- SideNote: this is where they put the room name */}
            <input
              type="text"
              className="border border-gray-400 px-3 py-2 rounded w-full"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />


            {/* Create Room button after they put in their new room name*/}
            <button
              className="bg-green-500 hover:bg-green-700 text-white px-8 py-2 rounded mt-4"
              onClick={() => {
                // Add logic for creating a room
                createRoomApiCall(roomName); //pass the user's input for room name to api call
       
                setShowCreatePopup(false);
              }}
            >
              Create Room
            </button>
          </div>
        </div>
      )}

{/*CREATE MEETING POPUP*/}
{showCreateMeetingPopup && (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="bg-white p-16 rounded-lg shadow-md relative w-80 flex flex-col items-center border border-gray-300">
      {/* Close button */}
      <button
        className="text-red-600 hover:text-red-800 absolute top-0 right-2"
        onClick={() => setShowCreateMeetingPopup(false)}
      >
        <span className="text-2xl font-bold">&times;</span>
      </button>

      <p className="text-lg font-semibold mb-4">Create a Meeting</p>

      {/* Date and time picker components */}
      <div className="p-26">
        <Popover placement="right">
          {/* Use the same Input component for date and time pickers */}
          <PopoverHandler>
            <Input
              onChange={() => null}
              value={meetingDate ? format(meetingDate, "PPP") : "Select a Date and Time"}
              className="rounded-lg"
            />
          </PopoverHandler>
          <PopoverContent>
                    {/*Date/Day picker */}
                    <DayPicker
                    mode="single"
                    selected={meetingDate}
                    onSelect={(date) => setMeetingDate(date)}
                    value = {setDate}
                    showOutsideDays
                    showTimeSelect
                    timeIntervals = {10}
                    timeFormat = "hh:mm"
                   
                    className="border-0"
                    classNames={{
                      caption: "flex justify-center py-2 mb-4 relative items-center",
                      caption_label: "text-sm font-medium text-gray-900",
                      nav: "flex items-center",
                      nav_button:
                        "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-full transition-colors duration-300",
                      nav_button_previous: "absolute left-1.5",
                      nav_button_next: "absolute right-1.5",
                      table: "w-full border-collapse",
                      head_row: "flex font-medium text-gray-900",
                      head_cell: "m-0.5 w-9 font-normal text-sm",
                      row: "flex w-full mt-2",
                      cell: "text-gray-600 rounded-full h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-full [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-full last:[&:has([aria-selected])]:rounded-full focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal",
                      day_range_end: "day-range-end",
                      day_selected:
                        "rounded-full bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                      day_today: "rounded-full bg-gray-200 text-gray-900",
                      day_outside:
                        "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                      day_disabled: "text-gray-500 opacity-50",
                      day_hidden: "invisible",
                    }}
                    components={{
                      IconLeft: ({ ...props }) => (
                        <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                      ),
                      IconRight: ({ ...props }) => (
                        <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                      ),
                    }}
                 
                  />


                  <hr className= "mt-4"></hr>


                  {/*Time picker*/}
                  <div className="mt-4 flex justify-center">
                    <select id="from" className="p-2 border border-gray-300" onChange={(e) => setFrom(e.target.value)}>
                      <option value="0">Select Time</option>
                      {generateTimeSlots().map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <b className="p-2">TO</b>
                    <select id="toDate" className="p-2 border border-gray-300" onChange={(e) => setTo(e.target.value)}>
                      <option value="0">Select Time</option>
                      {generateTimeSlots().map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Create Meeting button */}
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white px-10 py-2 rounded-lg mt-6 mb-2 ml-20"
                      onClick={() => {
                        handleCreateMeetingSubmit();
                        const customMessage = "Meeting has been scheduled"
                        alert(customMessage);
                      }}
                    >
                      Create
                    </button>
                  </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
{/*Below is the Availability popup box alongside its formatting*/}
      {showAvailabilityPopup && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-16 rounded-lg shadow-md relative w-80 flex flex-col items-center border border-gray-300">
           
            {/*
           
            The below would let users go back to the previous page    


            */}
            <button
              className="text-red-600 hover:text-red-800 absolute top-0 left-2"
              onClick={handlePreviousPagePopup}
            >
              <span className="text-2xl font-bold">&larr; </span>
            </button>


            <p className="text-lg font-semibold mb-4">Select your Availability</p>



            <div className="p-26">
              <Popover placement="right">
                <PopoverHandler>
                  <Input
                    onChange={() => null}
                    value={date ? format(date, "PPP") : "Select a Date and Time"}
                    className = "rounded-lg"
                  />
                </PopoverHandler>
                <PopoverContent>
                 
                  {/*Date/Day picker */}
                  <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    value = {setDate}
                    showOutsideDays
                    showTimeSelect
                    timeIntervals = {10}
                    timeFormat = "hh:mm"
                   
                    className="border-0"
                    classNames={{
                      caption: "flex justify-center py-2 mb-4 relative items-center",
                      caption_label: "text-sm font-medium text-gray-900",
                      nav: "flex items-center",
                      nav_button:
                        "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-full transition-colors duration-300",
                      nav_button_previous: "absolute left-1.5",
                      nav_button_next: "absolute right-1.5",
                      table: "w-full border-collapse",
                      head_row: "flex font-medium text-gray-900",
                      head_cell: "m-0.5 w-9 font-normal text-sm",
                      row: "flex w-full mt-2",
                      cell: "text-gray-600 rounded-full h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-full [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-full last:[&:has([aria-selected])]:rounded-full focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal",
                      day_range_end: "day-range-end",
                      day_selected:
                        "rounded-full bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                      day_today: "rounded-full bg-gray-200 text-gray-900",
                      day_outside:
                        "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                      day_disabled: "text-gray-500 opacity-50",
                      day_hidden: "invisible",
                    }}
                    components={{
                      IconLeft: ({ ...props }) => (
                        <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                      ),
                      IconRight: ({ ...props }) => (
                        <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                      ),
                    }}
                 
                  />


                  <hr className= "mt-4"></hr>


                  {/*Time picker*/}
                  <div className="mt-4 flex justify-center">
                    <select id="from" className="p-2 border border-gray-300" onChange={(e) => setFrom(e.target.value)}>
                      <option value="0">Select Time</option>
                      {generateTimeSlots().map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <b className="p-2">TO</b>
                    <select id="toDate" className="p-2 border border-gray-300" onChange={(e) => setTo(e.target.value)}>
                      <option value="0">Select Time</option>
                      {generateTimeSlots().map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                 


                 
                         
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-10 py-2 rounded-lg mt-6 mb-2 ml-20"
                    onClick={() => {
                      handleAvailabilitySubmit();
                      const customMessage = "Availability has been scheduled";
                      // just lets user know the button worked
                      alert(customMessage);
                    }}
                  >
                    Apply
                  </button>
                 
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
       
      )}
    </div>
  );
};


export default Room;


