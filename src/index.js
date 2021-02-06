import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './demo.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import Unified from "./MyFirstElement";
import Container from "./GitHubCards";
import CurrencyElement from "./CurrencyElement";
import PolygonSample from "./HexagonElement";
import TestComptForRegularConvexPolygon from "./second_iteration/TestComptForRegularConvexPolygon";

ReactDOM.render(
  <React.StrictMode>
    <TestComptForRegularConvexPolygon/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
