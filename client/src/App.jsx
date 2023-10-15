import './App.css';
import { useState, useEffect } from 'react';
import React from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";

//functions
import { getTest } from './functions/test';
import { Route, Routes } from "react-router-dom";


function App() {
  return(
  <React.Fragment>
    <header>
        <Header/>
    </header>
    <main>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/user" element={<Welcome />} />
      </Routes>
    </main> 
  </React.Fragment>
  )
};


export default App;
  
