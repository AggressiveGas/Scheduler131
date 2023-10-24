import './App.css'; // Import the CSS file for styling 
import React from "react"; // Import the React library
import Header from "./components/Header"; // Import the Header component
import Login from "./components/Login"; // Import the Login component
import Signup from "./components/Signup"; // Import the Signup component
import Welcome from "./components/Welcome"; // Import the Welcome component
import { Route, Routes } from "react-router-dom"; // Import Route and Routes from react-router-dom for defining routes

function App() {
  return (
    <React.Fragment>
      <header>
        <Header /> 
      </header>
      <main>
        <Routes>
          {/* Defining routes */}
          <Route path="/login" element={<Login />} /> {/* Route for the Login Page (Located In Components Folder) */}
          <Route path="/register" element={<Signup />} /> {/* Route for the Signup Page (Located In Components Folder) */}
          <Route path="/welcome/:userId" element={<Welcome />} /> {/* Route for the User's Welcome page (Located In Components Folder)*/}
        </Routes>
      </main>
    </React.Fragment>
  );
}

export default App;

  
