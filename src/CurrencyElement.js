import React from "react";
import './obsolete/GitHubCards.css';
import axios from 'axios';

class CurrencyElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            base: "TEST",
            rates: []
        };
    }

    componentDidMount() {
        //axios.get(`http://exchange-ball.ey.r.appspot.com/currency`).then(res => {
        axios.get(`http://localhost:8080/currency`).then(res => {
            console.log(res);
            //this.setState({base:res.data.base});
            this.setState(res.data);
        });

    }
    render() {
        return (
            <div>
                <p>{this.state.base}</p>
                <p>{JSON.stringify(this.state.rates)}</p>
            </div>
        );
    }
}

export default CurrencyElement;