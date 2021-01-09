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


function angleToRadians(degs) {
    return degs * (Math.PI / 180);
}

function generatePoints(numSides, radius, centerAng, startAngle) {
    const startAng = angleToRadians(startAngle);
    const vertex = [];
    for (let i = 0; i < numSides; i++) {
        const ang = startAng + (i * centerAng);
        let x = (radius * Math.cos(ang));
        let y = (radius * Math.sin(ang));
        vertex.push([x, y]);
    }
    return vertex;
}

function getEdgePoints(vertex) {
    const arrayColumn = (arr, n) => arr.map(x => x[n]);
    let xValues = arrayColumn(vertex, 0);
    let yValues = arrayColumn(vertex, 1);
    let maxX = Math.max(...xValues);
    let maxY = Math.max(...yValues);
    let minX = Math.min(...xValues);
    let minY = Math.min(...yValues);
    return {
        minX: Math.floor(minX),
        minY: Math.floor(minY),
        maxX: Math.ceil(maxX),
        maxY: Math.ceil(maxY)
    };
}

function getDimensions(edges) {
    return {
        xDim: Math.ceil(edges.maxX - edges.minX),
        yDim: Math.ceil(edges.maxY - edges.minY)
    };
}

function getShiftedPositiveQuadrant(points, edges) {
    let shiftedPoints = JSON.parse(JSON.stringify(points));
    shiftedPoints.map(pair => {
        pair[0] += -1 * edges.minX;
        pair[1] += -1 * edges.minY;
    });
    return shiftedPoints;
}

class RegularConvexPolygon extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            radius: 10,
            edgeOffsetRatio: 0.07,
            startAngle: 90,
            numSides: 6,
            centerAng: 0,
            generatedPoints: [],
            edgeOffsetLen: 0,
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0,
            xDim: 0,
            yDim: 0,
            polygonCoordinates: ""
        };

        this.state.centerAng = 2 * Math.PI / this.state.numSides;
        this.state.edgeOffsetLen = this.state.radius * this.state.edgeOffsetRatio / 2;

        let generatedPoints = generatePoints(
            this.state.numSides,
            this.state.radius,
            this.state.centerAng,
            this.state.startAngle);

        let generatedPointsOuter = generatePoints(
            this.state.numSides,
            this.state.radius + this.state.edgeOffsetLen,
            this.state.centerAng,
            this.state.startAngle);

        let edges = getEdgePoints(generatedPoints);
        let outerEdges = getEdgePoints(generatedPointsOuter);
        generatedPoints = getShiftedPositiveQuadrant(generatedPoints, outerEdges);
        let dimensions = getDimensions(outerEdges);
        let polygonCoordinates = generatedPoints.map(pair => pair.join(',')).join(' ');

        this.state.generatedPoints = generatedPoints;
        this.state.minX = edges.minX;
        this.state.minY = edges.minY;
        this.state.maxX = edges.maxX;
        this.state.maxY = edges.maxY;
        this.state.xDim = dimensions.xDim;
        this.state.yDim = dimensions.yDim;
        this.state.polygonCoordinates = polygonCoordinates;


        this.props.parentCallback(this.state);
    }

    render() {
        const bottomStyle = {
            fill: '#' + Math.floor(Math.random() * 16777215).toString(16),
            stroke: '#' + Math.floor(Math.random() * 16777215).toString(16),
            strokeWidth: this.state.radius * this.state.edgeOffsetRatio,
            verticalAlign: 'top',
        };
        return (

            <svg height={this.state.yDim} width={this.state.xDim} style={bottomStyle}>
                <polygon points={this.state.polygonCoordinates}/>
            </svg>


        );
    }
}

class PolygonSample extends React.Component {

    state = {leftMargin: 0, topMargin: 0, axialArray: [[1, 2]]}
    callbackFunction = (childData) => {
        let tempLeft = Math.floor(childData.xDim / 2);
        let tempTop = Math.floor(childData.yDim / 4);
        //tempLeft = 0;
        //tempTop = 0;


        let length = 105;
        let height = 79;
        length = length % 2 == 1 ? length : length + 1;
        height = height % 2 == 1 ? height : height + 1;

        let originMinCoordinateX = -((length - 1) / 2);
        let originMinCoordinateY = -((height - 1) / 2);

        let topLeftCoordinateX = originMinCoordinateX + Math.floor(-originMinCoordinateY / 2);
        let topLeftCoordinateY = originMinCoordinateY;

        let tempStartX = topLeftCoordinateX;
        let tempStartY = topLeftCoordinateY;

        let axialArray = [];
        for (let j = 0; j < height; j++) {
            axialArray.push([]);
            for (let i = 0; i < length; i++) {
                axialArray[j].push((tempStartX + i - Math.floor(j / 2)) + "," + (tempStartY + j));
            }
        }

        let debug = 19;
        this.setState({leftMargin: tempLeft, topMargin: tempTop, axialArray: axialArray});
    }

    render() {
        return (
            <section>
                <div></div>
                {

                    this.state.axialArray.map((row, index) => {
                            if (index % 2 == 0)
                                if (index == 0) {
                                    return <div
                                        style={{
                                            marginBottom: -this.state.topMargin
                                        }}>{
                                        row.map((element, index) => <RegularConvexPolygon
                                            parentCallback={this.callbackFunction}/>)
                                    }</div>
                                } else {
                                    return <div style={{
                                        marginTop: -this.state.topMargin,
                                        marginBottom: -this.state.topMargin
                                    }}>{

                                        row.map((element, index) => <RegularConvexPolygon
                                            parentCallback={this.callbackFunction}/>)
                                    }</div>
                                }
                            else {
                                return <div
                                    style={{
                                        marginLeft: this.state.leftMargin, marginTop: -this.state.topMargin,
                                        marginBottom: -this.state.topMargin
                                    }}>{
                                    row.map((element, index) => <RegularConvexPolygon
                                        parentCallback={this.callbackFunction}/>)
                                }</div>
                            }

                        }
                    )
                }
            </section>
        );
    }
}

export default PolygonSample;