import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './obsolete/demo.css'
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css';
import CurrencyMultipleSearchSelection from "./hexagon_currency_app/CurrencyMultipleSearchSelection";
import CurrencySearchSelection from "./hexagon_currency_app/CurrencySearchSelection";
import CurrencyManager from "./hexagon_currency_app/CurrencyManager";

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
