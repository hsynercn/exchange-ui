import React from "react";
import Container from "./GitHubCards";

class Left extends React.Component {
    render() {
        const leftStyle = {
            float: "left",
            width: 0,
            borderRight: "30px solid #6C6",
            borderTop: "52px solid transparent",
            borderBottom: "52px solid transparent"
        };
        return (
            <div style={leftStyle}></div>
        );
    }
}

class Middle extends React.Component {
    render() {
        const middleStyle = {
            float: "left",
            width: "60px",
            height: "104px",
            background: "#6C6"
        };
        return (
            <div style={middleStyle}></div>
        );
    }
}

class Right extends React.Component {
    render() {
        const rightStyle = {
            float: "left",
            width: 0,
            borderLeft: "30px solid #6C6",
            borderTop: "52px solid transparent",
            borderBottom: "52px solid transparent"
        };
        return (
            <div style={rightStyle}></div>
        );
    }
}

class HexOdd extends React.Component {
    render() {
        return(<div><Left/><Middle/><Right/></div>);
    }
}

export default HexOdd;