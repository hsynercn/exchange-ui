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
        return (<div><Left/><Middle/><Right/></div>);
    }
}

class HorizontalHexagon extends React.Component {
    render() {
        const leftStyle = {
            float: "left",
            width: 0,
            borderRight: "30px solid #6C6",
            borderTop: "52px solid transparent",
            borderBottom: "52px solid transparent"
        };
        const middleStyle = {
            float: "left",
            width: "60px",
            height: "104px",
            background: "#6C6"
        };
        const rightStyle = {
            float: "left",
            width: 0,
            borderLeft: "30px solid #6C6",
            borderTop: "52px solid transparent",
            borderBottom: "52px solid transparent"
        };
        return (<div>
            <div style={leftStyle}></div>
            <div style={middleStyle}></div>
            <div style={rightStyle}></div>
        </div>);
    }
}

class VerticalHexagon extends React.Component {
    render() {
        const topStyle = {
            width: 0,
            borderBottom: "30px solid #6C6",
            borderLeft: "52px solid transparent",
            borderRight: "52px solid transparent"
        };
        const middleStyle = {
            width: "104px",
            height: "60px",
            background: "#6C6"
        };
        const bottomStyle = {
            width: 0,
            borderTop: "30px solid #6C6",
            borderLeft: "52px solid transparent",
            borderRight: "52px solid transparent"
        };
        return (<div>
            <div style={topStyle}></div>
            <div style={middleStyle}></div>
            <div style={bottomStyle}></div>
        </div>);
    }
}

class HexagonShowcase extends React.Component {
    render() {
        return (<div>
            <VerticalHexagon/>
        </div>);
    }
}

const numSides = 6
const centerAng = 2 * Math.PI / numSides

function angleToRadians(degs) {
    return degs * (Math.PI / 180);
}

function generatePoints(radius, offset, startAngle) {
    const startAng = angleToRadians(startAngle);
    const vertex = [];
    for (let i = 0; i < numSides; i++) {
        const ang = startAng + (i * centerAng);
        let x = offset + (radius * Math.cos(ang));
        let y = offset + (radius * Math.sin(ang));
        vertex.push([x, y]);
    }
    return vertex;
}

function shiftPositiveQuadrant(vertex) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    vertex.forEach(point => {
        let pointX = point[0];
        let pointY = point[1];
        minX = (minX > pointX) ? pointX : minX;
        maxX = (maxX < pointX) ? pointX : maxX;
        minY = (minY > pointY) ? pointY : minY;
        maxY = (maxY < pointY) ? pointY : maxY;
    });
    return {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
    };
}

let generatedPoints = generatePoints(200, 0, 66);
console.log("points:");
console.log(generatedPoints);
let edges = shiftPositiveQuadrant(generatedPoints);

generatedPoints.map(pair => {
    pair[0] += -1 * edges.minX;
    pair[1] += -1 * edges.minY
});

console.log("polygon coordinates:");
let polygonCoordinates = generatedPoints.map(pair => pair.join(',')).join(' ');
console.log(polygonCoordinates)

/*<polygon points="0.000001,140 300,210 170,250 123,234"/>*/

class PolygonSample extends React.Component {
    render() {
        return (
            <div>
                <svg height="500" width="500">
                    <polygon points={polygonCoordinates}/>
                </svg>
                <svg height="500" width="500">
                    <polygon points={polygonCoordinates}/>
                </svg>
                <svg height="500" width="500">
                    <polygon points={polygonCoordinates}/>
                </svg>
            </div>

        );
    }
}

export default PolygonSample;