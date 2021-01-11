import React from "react";

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
            radius: 50,
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
            polygonCoordinates: "",
            fillColor: "",
            strokeColor: ""
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


        this.state.fillColor = this.props.colorSet.fillColor;
        this.state.strokeColor = this.props.colorSet.strokeColor;

        this.props.parentCallback(this.state);
    }

    setColor = (fillColor, strokeColor) => {
        this.state.fillColor = fillColor;
        this.state.strokeColor = strokeColor;
        this.setState(this.state);
    }

    render() {
        return (
            <svg height={this.state.yDim} width={this.state.xDim} style={{
                fill: this.state.fillColor,
                stroke: this.state.strokeColor,
                strokeWidth: this.state.radius * this.state.edgeOffsetRatio,
                verticalAlign: 'top'
            }}>
                <polygon points={this.state.polygonCoordinates}/>
            </svg>
        );
    }
}


class PolygonSample extends React.Component {

    constructor(props) {
        super(props)

        this.state = {leftMargin: 0, topMargin: 0, axialArray: [[]], axialMap: {}, axialColorMap: {}};

        //this.handler = this.handler.bind(this)

        let length = 19;
        let height = 19;
        length = length % 2 == 1 ? length : length + 1;
        height = height % 2 == 1 ? height : height + 1;

        let originMinCoordinateX = -((length - 1) / 2);
        let originMinCoordinateY = -((height - 1) / 2);

        let topLeftCoordinateX = originMinCoordinateX + Math.floor(-originMinCoordinateY / 2);
        let topLeftCoordinateY = originMinCoordinateY;

        let tempStartX = topLeftCoordinateX;
        let tempStartY = topLeftCoordinateY;

        let axialArray = [];
        let axialMap = {};
        let axialColorMap = {};
        for (let j = 0; j < height; j++) {
            axialArray.push([]);
            for (let i = 0; i < length; i++) {
                let coordinateStr = (tempStartX + i - Math.floor(j / 2)) + "," + (tempStartY + j)
                axialArray[j].push(coordinateStr);
                axialMap[coordinateStr] = React.createRef();
                axialColorMap[coordinateStr] = {
                    fillColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
                    strokeColor: '#' + Math.floor(Math.random() * 16777215).toString(16)
                };
            }
        }

        this.state.axialArray = axialArray;
        this.state.axialMap = axialMap;
        this.state.axialColorMap = axialColorMap;

        this.state.lastRenderX = 0;
        this.state.lastRenderY = 0;
    }


    getNorthSequence(value) {
        let sequence = [];

        let startX = 1;
        let startY = -2;

        let x = startX;
        let y = startY;

        let polygonCount = Math.ceil(value);
        let tmpCount = 0;


        for (let i = 1; tmpCount < polygonCount; i++) {
            x = startX;
            for (let j = 1; j<=i && tmpCount < polygonCount; j++) {
                sequence.push(x + "," + y);
                x++;
                tmpCount++;
            }
            y--;
        }

        return sequence;
    }

    componentDidMount() {
        this.interval = setInterval(() => {

            let sequence1 = this.getNorthSequence(0.1);
            let sequence2 = this.getNorthSequence(1.5);
            let sequence3 = this.getNorthSequence(2.5);
            let sequence4 = this.getNorthSequence(3.5);
            let sequence5 = this.getNorthSequence(4.5);
            let sequence6 = this.getNorthSequence(5.5);
            let sequence7 = this.getNorthSequence(6.5);
            let sequence8 = this.getNorthSequence(7.5);

            let selectedRow = this.state.axialArray[Math.floor(Math.random() * this.state.axialArray.length)];
            let selectedElement = selectedRow[Math.floor(Math.random() * selectedRow.length)];
            let regularConvexPolygonRef = this.state.axialMap[selectedElement];

            let d = new Date();
            let n = d.getSeconds();

            if (Math.floor(n / 10) % 2 == 0) {
                let colorStr = '#' + Math.floor(Math.random() * 16777215).toString(16);
                regularConvexPolygonRef.current.setColor(colorStr, colorStr);
            } else {
                let colorStr = '#' + Math.floor(Math.random() * 16777215).toString(16);
                let colorStr2 = '#' + Math.floor(Math.random() * 16777215).toString(16);
                regularConvexPolygonRef.current.setColor(colorStr, colorStr2);
            }
        }, 1);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    callbackFunction = (childData) => {
        if (this.state.leftMargin == 0 && this.state.topMargin == 0) {
            let tempLeft = Math.floor(childData.xDim / 2);
            let tempTop = Math.floor(childData.yDim / 4);

            this.setState({
                leftMargin: tempLeft,
                topMargin: tempTop,
                axialArray: this.state.axialArray,
                axialMap: this.state.axialMap
            });
        }
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
                                            parentCallback={this.callbackFunction} ref={this.state.axialMap[element]}
                                            colorSet={this.state.axialColorMap[element]}/>)
                                    }</div>
                                } else {
                                    return <div style={{
                                        marginTop: -this.state.topMargin,
                                        marginBottom: -this.state.topMargin
                                    }}>{

                                        row.map((element, index) => <RegularConvexPolygon
                                            parentCallback={this.callbackFunction} ref={this.state.axialMap[element]}
                                            colorSet={this.state.axialColorMap[element]}/>)
                                    }</div>
                                }
                            else {
                                return <div
                                    style={{
                                        marginLeft: this.state.leftMargin, marginTop: -this.state.topMargin,
                                        marginBottom: -this.state.topMargin
                                    }}>{
                                    row.map((element, index) => <RegularConvexPolygon
                                        parentCallback={this.callbackFunction} ref={this.state.axialMap[element]}
                                        colorSet={this.state.axialColorMap[element]}/>)
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