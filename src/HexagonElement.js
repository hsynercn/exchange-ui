import React from "react";

function angleToRadians(degree) {
    return degree * (Math.PI / 180);
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
        return true;
    });
    return shiftedPoints;
}

class RegularConvexPolygon extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            radius: 30,
            edgeOffsetRatio: 0.09,
            startAngle: 90,
            numSides: 6,
            centerAng: 0,
            generatedPoints: [],
            edgeOffsetLen: 0,
            edges: {},
            xDim: 0,
            yDim: 0,
            polygonCoordinates: "",
            polygonCoordinatesInner: "",
            fillColor: "",
            strokeColor: "",
            text: "",
            innerPolygonRatio: 0.0,
            innerFillColor: "",
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

        let generatedPointsInner = generatePoints(
            this.state.numSides,
            (this.state.radius + this.state.edgeOffsetLen) * this.state.innerPolygonRatio,
            this.state.centerAng,
            this.state.startAngle);

        this.state.edges = getEdgePoints(generatedPointsOuter);

        generatedPoints = getShiftedPositiveQuadrant(generatedPoints, this.state.edges);
        let dimensions = getDimensions(this.state.edges);

        generatedPointsInner = getShiftedPositiveQuadrant(generatedPointsInner, this.state.edges);

        let polygonCoordinates = generatedPoints.map(pair => pair.join(',')).join(' ');
        let polygonCoordinatesInner = generatedPointsInner.map(pair => pair.join(',')).join(' ');


        this.state.generatedPoints = generatedPoints;
        this.state.generatedInnerPoints = polygonCoordinatesInner;

        this.state.xDim = dimensions.xDim;
        this.state.yDim = dimensions.yDim;
        this.state.polygonCoordinates = polygonCoordinates;
        this.state.polygonCoordinatesInner = polygonCoordinatesInner;

        this.state.fillColor = this.props.colorSet.fillColor;
        this.state.strokeColor = this.props.colorSet.strokeColor;

        this.props.parentCallback(this.state);
    }

    setColor = (fillColor, strokeColor, innerFillColor) => {
        this.setState({fillColor: fillColor, strokeColor: strokeColor, innerFillColor: innerFillColor});
    }

    setInnerPolygonRatio = (ratio) => {

        let generatedPointsInner = generatePoints(
            this.state.numSides,
            (this.state.radius + this.state.edgeOffsetLen) * ratio,
            this.state.centerAng,
            this.state.startAngle);
        generatedPointsInner = getShiftedPositiveQuadrant(generatedPointsInner, this.state.edges);
        let polygonCoordinatesInner = generatedPointsInner.map(pair => pair.join(',')).join(' ');
        this.setState({innerPolygonRatio: ratio, polygonCoordinatesInner: polygonCoordinatesInner});
    }

    render() {
        return (
            <svg height={this.state.yDim} width={this.state.xDim} style={{
                verticalAlign: 'top'
            }}>

                <polygon points={this.state.polygonCoordinates} style={{
                    fill: this.state.fillColor,
                    stroke: this.state.strokeColor,
                    strokeWidth: this.state.radius * this.state.edgeOffsetRatio,
                    verticalAlign: 'top'
                }}/>
                <polygon points={this.state.polygonCoordinatesInner} style={{
                    fill: this.state.innerFillColor,
                    verticalAlign: 'top'
                }}/>
                <text x="50%" y="54%" textAnchor="middle" fontFamily="Courier New"
                      fill="black" fontWeight="bold" fontSize="14">
                    {this.state.text}
                </text>
            </svg>
        );
    }
}


const directions = {
    NORTH: "NORTH",
    SOUTH: "SOUTH",
    NORTHEAST: "NORTHEAST",
    SOUTHWEST: "SOUTHWEST",
    NORTHWEST: "NORTHWEST",
    SOUTHEAST: "SOUTHEAST",
}

//TODO:we can use inner polygons for float numbers
//TODO:adapt inner texts to this method
//TODO:send a real request for currency data

class PolygonSample extends React.Component {

    constructor(props) {
        super(props)


        this.state = {leftMargin: 0, topMargin: 0, axialArray: [[]], axialMap: {}, axialColorMap: {}};


        let length = 27;
        let height = 19;
        length = length % 2 === 1 ? length : length + 1;
        height = height % 2 === 1 ? height : height + 1;

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
                    fillColor: '#ffffff',
                    strokeColor: '#e2e2e2'
                };
            }
        }
        this.state.axialArray = axialArray;
        this.state.axialMap = axialMap;
        this.state.axialColorMap = axialColorMap;

        this.state.lastRenderX = 0;
        this.state.lastRenderY = 0;
    }


    getSequence(startX, startY, value, direction) {
        let sequence = [];
        let refX = startX;
        let refY = startY;

        let polygonCount = Math.ceil(value);
        let tmpCount = 0;

        let factor;
        if (direction === directions.NORTH || direction === directions.NORTHEAST || direction === directions.NORTHWEST) {
            factor = 1;
        } else {
            factor = -1;
            refX = -refX;
            refY = -refY;
        }

        let x = refX;
        let y = refY;

        if (direction === directions.NORTH || direction === directions.SOUTH) {
            for (let i = 1; tmpCount < polygonCount; i++) {
                x = refX;
                for (let j = 1; j <= i && tmpCount < polygonCount; j++) {
                    sequence.push(factor * x + "," + factor * y);
                    x++;
                    tmpCount++;
                }
                y--;
            }
        } else if (direction === directions.NORTHEAST || direction === directions.SOUTHWEST) {
            for (let i = 1; tmpCount < polygonCount; i++) {
                y = refY;
                for (let j = 1; j <= i && tmpCount < polygonCount; j++) {
                    sequence.push(factor * x + "," + factor * y);
                    y++;
                    tmpCount++;
                }
                x++;
                refY--;
            }
        } else if (direction === directions.NORTHWEST || direction === directions.SOUTHEAST) {
            for (let i = 1; tmpCount < polygonCount; i++) {
                x = refX;
                y = refY;
                for (let j = 1; j <= i && tmpCount < polygonCount; j++) {
                    sequence.push(factor * x + "," + factor * y);
                    x++;
                    y--;
                    tmpCount++;
                }
                refX--;
            }
        }

        return sequence;

    }



    componentDidMount() {

        let bias = 5;
        let range = 5;

        let innerFiller = '#0020c4';


        let displayValueArray1 = Math.random() * range + bias;

        let sequenceNorth = this.getSequence(1, -2, displayValueArray1, directions.NORTH);

        sequenceNorth.map(element => {
            if(displayValueArray1 <= 1.0) {
                this.state.axialMap[element].current.setColor('#ffffff', '#e2e2e2', '#ea0000');
                this.state.axialMap[element].current.setInnerPolygonRatio(displayValueArray1);
            } else {
                this.state.axialMap[element].current.setColor('#ea0000', '#ea0000', '#ea0000');
                displayValueArray1--;
            }
            return true;
        });

        let displayValueArray2 = Math.random() * range + bias;

        let sequenceSouth = this.getSequence(-1, 2, displayValueArray2, directions.SOUTH);
        sequenceSouth.map(element => {
            if(displayValueArray2 <= 1.0) {
                this.state.axialMap[element].current.setColor('#ffffff', '#e2e2e2', '#2549fd');
                this.state.axialMap[element].current.setInnerPolygonRatio(displayValueArray2);
            } else {
                this.state.axialMap[element].current.setColor('#2549fd', '#2549fd', '#2549fd');
                displayValueArray2--;
            }
            return true;
        });

        let displayValueArray3 = Math.random() * range + bias;

        let sequenceNorthEast = this.getSequence(2, -1, displayValueArray3, directions.NORTHEAST);
        sequenceNorthEast.map(element => {

            if(displayValueArray3 <= 1.0) {
                this.state.axialMap[element].current.setColor('#ffffff', '#e2e2e2', '#9400ff');
                this.state.axialMap[element].current.setInnerPolygonRatio(displayValueArray3);
            } else {
                this.state.axialMap[element].current.setColor('#9400ff', '#9400ff', '#9400ff');
                displayValueArray3--;
            }
            return true;
        });

        let sequenceSouthWest = this.getSequence(-2, 1, Math.random() * range + bias, directions.SOUTHWEST);
        sequenceSouthWest.map(element => {
            this.state.axialMap[element].current.setColor('#5dff00', '#5dff00', innerFiller);
            this.state.axialMap[element].current.setInnerPolygonRatio(Math.random());
            return true;
        });

        let sequenceNorthWestSequence = this.getSequence(-1, -1, Math.random() * range + bias, directions.NORTHWEST);
        sequenceNorthWestSequence.map(element => {
            this.state.axialMap[element].current.setColor('#00daf1', '#00daf1', innerFiller);
            this.state.axialMap[element].current.setInnerPolygonRatio(Math.random());
            return true;
        });

        let sequenceSouthEast = this.getSequence(1, 1, Math.random() * range + bias, directions.SOUTHEAST);
        sequenceSouthEast.map(element => {
            this.state.axialMap[element].current.setColor('#00ffa6', '#00ffa6', innerFiller);
            this.state.axialMap[element].current.setInnerPolygonRatio(Math.random());
            return true;
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    callbackFunction = (childData) => {

        let tempLeft = Math.floor(childData.xDim / 2);
        let tempTop = Math.floor(childData.yDim / 4);

        this.setState({
            leftMargin: tempLeft,
            topMargin: tempTop,
            axialArray: this.state.axialArray,
            axialMap: this.state.axialMap
        });

        if (this.state.leftMargin === 0 && this.state.topMargin === 0) {
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
                {
                    this.state.axialArray.map((row, index) => {
                            if (index % 2 === 0)
                                if (index === 0) {
                                    return <div
                                        style={{
                                            marginBottom: -this.state.topMargin
                                        }}>{
                                        row.map((element) => <RegularConvexPolygon
                                            parentCallback={this.callbackFunction} ref={this.state.axialMap[element]}
                                            colorSet={this.state.axialColorMap[element]}/>)
                                    }</div>
                                } else {
                                    return <div style={{
                                        marginTop: -this.state.topMargin,
                                        marginBottom: -this.state.topMargin
                                    }}>{

                                        row.map((element) => <RegularConvexPolygon
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
                                    row.map((element) => <RegularConvexPolygon
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