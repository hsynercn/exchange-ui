import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './demo.css'
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css';
import CurrencyMultipleSearchSelection from "./second_iteration/CurrencyMultipleSearchSelection";
import CurrencySearchSelection from "./second_iteration/CurrencySearchSelection";
import CurrencyManager from "./second_iteration/CurrencyManager";

ReactDOM.render(
    <React.StrictMode>
        <CurrencyManager/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
