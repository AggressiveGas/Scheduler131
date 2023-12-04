import React, { useState, useEffect } from 'react';
import TimezoneSelect from "react-timezone-select";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; //going to be used to calls like on any other form {personally I like axios}
import './RoomStyling.css';

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
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowAddPopup(false);
    setShowCreatePopup(false);
    setShowAvailabilityPopup(false);
  };

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

            <button
            //this is the green "create" button below  the "OR" statement
              className="bg-blue-500 hover:bg-blue-700 text-white px-8 py-2 rounded mb-2"
              onClick={handleAvailability}
            >
              Availability
              {/*<a href="" onClick={() => navigate("/availability")} className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"></a>*/}
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
          <div className="bg-white p-8 rounded-lg shadow-md relative w-80 flex flex-col items-center border border-gray-300">
            <button
              className="text-red-600 hover:text-red-800 absolute top-0 right-2"
              onClick={handleClosePopup}
            >
              <span className="text-2xl font-bold">&times;</span>
            </button>

            <p className="text-lg font-semibold mb-4">Select your Availability</p>
            <p className="text-lg font-semibold mb-2">Pick your Timezone</p>
            <TimezoneSelect
              value={selectedtimezone}
              onChange={setSelectedTimezone}
            />
            <a href="#" onClick={() => navigate("/availability")} className="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100">
              Link to Availability
            </a>
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
