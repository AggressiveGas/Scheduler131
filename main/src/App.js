import './App.css';
import React, { useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import Home from "./util/Home";
import Login from "./util/Login";
import Register from "./util/Register";

export default function App() {
	return (
    
    <React.Fragment>
      <Header />
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/login" element = {<Login />} />
        <Route path = "/register" element = {<Register />} />
    
      </Routes>
    </React.Fragment>
	);
}






/*
export default function App() {
  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  )
}*/


/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/
