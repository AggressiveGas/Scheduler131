import './App.css';
import { useState, useEffect } from 'react';


//functions
import { getTest } from './functions/test';

function App() {
  const [data, setData] = useState("Hello World!");

  useEffect(() => {
    getTest()
      .then((res) => {
        setData(res.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="App">
      <h1>{data}</h1>
      <img src="https://i.gifer.com/XOsX.gif" alt="duck" />
    </div>
  );
};

export default App;
