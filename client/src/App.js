import React, { useState, useEffect } from 'react'
import {ProductList} from './Components/ProductList.js';
import logo from './logo.svg';
import './App.css';

export const App = (props) => {
  const [list23, setList23] = useState({});
  const [count, setCount] = useState(0);
  //populate products with information
    useEffect( () => {
      fetch("http://localhost:3000/express_backend")
        .then(res => res.json())
        .then(
          (result) => {
            setList23(state => ({ ...state, result }));
         }).catch((e) => { 
          setCount(count + 1);
        });
    },[list23]);
  return (
    <div className="App">
      <ProductList list={list23}/>
      {/* <header className="App-header">
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
      </header> */}
    </div>
  );
}

export default App;
