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

  const handleRoomClick = (room) => {
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

            {/* Delete this when availabilities are resolved
            <DateTimePicker
              ranges={ranges}
              start={range.start}
              end={range.end}
              local={local}
              maxDate={maxDate}
              applyCallback={handleApply}
            > 
              <a href="#" onClick={handleAvailability} 
                className="block rounded-lg px-3 py-2 mt-2 text-sm font-semibold leading-6 text-gray-900 bg-gray-100 hover:bg-gray-300"
              >  
                DateTimePicker UI
              </a>
            </DateTimePicker>

            */}
            <a href="#" onClick={handleAvailability} 
                className="block rounded-lg px-3 py-2 mt-2 text-sm font-semibold leading-6 text-gray-900 bg-gray-100 hover:bg-gray-300"
            >  
                Add your Availability
            </a>


            <p className='pt-4'><b>Group's Availability</b></p>
            {/*
            
            Groups Availability will go here
            
            */}

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
              <span className="text-2xl font-bold">&larr;	</span>
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
                  <div className = "mt-4 flex justify-center">
                    <select id="from" className = "p-2 border border-gray-300" onChange={t=> setFrom(t)} >
                      <option value="0">Select Time</option>
                      <option value="12">12 PM</option>
                      .
                      .
                      . 
                      <option value="11">11 AM</option>
                    </select>
                    <b className= "p-2">TO</b>

                    <select id="toDate" className = "p-2 border border-gray-300" onChange={t=> setTo(t)} >
                      <option value="0">Select Time</option>
                      <option value="12">12 PM</option>
                      .
                      .
                      . 
                      <option value="11">11 AM</option>
                    </select>
                  </div>
                  

                  
                         
                  <button 
                    className="bg-red-500 hover:bg-red-700 text-white px-10 py-2 rounded-lg mt-6 mb-2 ml-20"
                    onClick={() => SplitDate(setDate)}>
                      Apply
                  </button>
                  
                </PopoverContent>
              </Popover>
            </div>











            
            {/* Snippet for timezone selection 
            <p className="text-lg font-semibold mb-2">Pick your Timezone</p>
            <TimezoneSelect
              value={selectedtimezone}
              onChange={setSelectedTimezone}
            />
            */}

            
               {/* useNavigate('/Availability'); /*this is the button that will take you to the availability page*/}

            {/* keep this as it is if anyone wants to use this code. later on, we can delete it*/}

            {/* Input textbox for entering room code 
            <input
              type="text"
              className="border border-gray-400 px-3 py-2 rounded w-full"
              placeholder="Enter code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            */}

             {/* Join Room button after they put in their code
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white px-8 py-2 rounded mt-4"
              onClick={() => {
                // Add logic for joining a room
                joinRoomApiCall(roomCode); //pass the user's input value to the call
        
                setShowAddPopup(false);
              }} 
            >
              Join Room
            </button> */}
          </div>
        </div>
        
      )}
    </div>
  );
};

export default Room;
