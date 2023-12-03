import React, { useState } from 'react';
import axios from 'axios'; //going to be used to calls like on any other form {personally I like axios}


//Pop-ups that the user would see(the UI setup for rooms)
const Room = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showAvailabilityPopup, setShowAvailabilityPopup] = useState(false);
  const [roomCode, setRoomCode] = useState(''); //holds the entered room code
  const [roomName, setRoomName] = useState(''); //holds the entered room name


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

//everything below is formatting/buttons/inputs for the pop up forms.
  return (
    <div className="container flex flex-col items-start justify-start h-screen px-9 py-12 relative">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-10 px-16 rounded flex items-center"
        onClick={handleAddClick}
      >
        <span className="mr-2 text-4xl">+</span>
        Add Room
      </button>

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
