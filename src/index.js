import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import CurrencyManager from "./hexagon_currency_app/Currency/CurrencyManager";

ReactDOM.render(
    <React.StrictMode>
        <CurrencyManager/>
    </React.StrictMode>,
    document.getElementById('root')
);

