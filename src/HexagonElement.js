import React from "react";
import axios from 'axios';
import {currencyColors} from './CurrencyColors'

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
            radius: this.props.polygon.radius,
            edgeOffsetRatio: this.props.polygon.edgeOffsetRatio,
            startAngle: this.props.polygon.startAngle,
            numSides: this.props.polygon.numSides,
            centerAng: 0,
            generatedPoints: [],
            edgeOffsetLen: 0,
            edges: {},
            xDim: 0,
            yDim: 0,
            polygonCoordinates: "",
            polygonCoordinatesInner: "",
            fillColor: this.props.polygon.fillColor,
            strokeColor: this.props.polygon.strokeColor,
            text: this.props.polygon.text,
            textFontSize: this.props.polygon.textFontSize,
            innerPolygonRatio: this.props.polygon.innerPolygonRatio,
            innerFillColor: this.props.polygon.innerFillColor,
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

        this.state.fillColor = this.props.polygon.fillColor;
        this.state.strokeColor = this.props.polygon.strokeColor;

        this.props.parentCallback(this.state);
    }

    setText = (text) => {
        this.setState({text: text});
    }

    setTextWithFontSize = (text, textFontSize) => {
        this.setState({text: text, textFontSize: textFontSize});
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
                <text x="50%" y="57%" style={{whiteSpace: "pre-line"}} textAnchor="middle" fontFamily="Arial"
                      fill="black" fontWeight="bold" fontSize={this.state.textFontSize} fontWeight="normal">
                    {this.state.text}
                </text>
            </svg>
        );
    }
}

function LightenDarkenColor(col, amt) {

    let usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    let num = parseInt(col, 16);

    let r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

const directions = {
    NORTH: "NORTH",
    SOUTH: "SOUTH",
    NORTHEAST: "NORTHEAST",
    SOUTHWEST: "SOUTHWEST",
    NORTHWEST: "NORTHWEST",
    SOUTHEAST: "SOUTHEAST",
}


class PolygonSample extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            polygonCountLength: 17,
            polygonCountHeight: 15,
            leftMargin: 0,
            topMargin: 0,
            axialArray: [[]],
            axialMap: {},
            defaultUnitPolygon: {
                radius: 40,
                edgeOffsetRatio: 0.03,
                startAngle: 90,
                numSides: 6,
                fillColor: '#ffffff',
                strokeColor: '#e2e2e2',
                text: "",
                textFontSize: 14,
                innerPolygonRatio: 0.0,
                innerFillColor: "",
            },
            axialPolygonMap: {},
            maxPolygonGroupMemberCount: 15,
        };


        let length = this.state.polygonCountLength;
        let height = this.state.polygonCountHeight;
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
        for (let j = 0; j < height; j++) {
            axialArray.push([]);
            for (let i = 0; i < length; i++) {
                let coordinateStr = (tempStartX + i - Math.floor(j / 2)) + "," + (tempStartY + j)
                axialArray[j].push(coordinateStr);
                axialMap[coordinateStr] = React.createRef();
            }
        }
        this.state.axialArray = axialArray;
        this.state.axialMap = axialMap;

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


    renderDirection(currencyText, startX, startY, displayValue, direction, maxPolygonGroupMemberCount, fillColor, strokeColor, innerFillColor, axialMap) {
        let sequence = this.getSequence(startX, startY, maxPolygonGroupMemberCount, direction);

        displayValue = displayValue.toFixed(2);
        let stepValue = 1.0;
        let segmentCount = Math.ceil(displayValue / stepValue);
        let sum = 0;
        segmentCount = segmentCount > maxPolygonGroupMemberCount ? maxPolygonGroupMemberCount : segmentCount;

        axialMap[sequence[0]].current.setTextWithFontSize(currencyText, 20);
        let textBlockColor = LightenDarkenColor(innerFillColor, 30);
        axialMap[sequence[0]].current.setColor(textBlockColor, textBlockColor, textBlockColor);

        for (let i = 1; i < (segmentCount + 1); i++) {
            if (displayValue < 1.0) {
                axialMap[sequence[i]].current.setText((sum + displayValue).toFixed(2));
                axialMap[sequence[i]].current.setColor(fillColor, strokeColor, innerFillColor);
                axialMap[sequence[i]].current.setInnerPolygonRatio(displayValue);
            } else {
                sum += stepValue;
                axialMap[sequence[i]].current.setText(sum.toFixed(1));
                axialMap[sequence[i]].current.setColor(innerFillColor, strokeColor, innerFillColor);
                displayValue--;
            }
        }
    }

    componentDidMount() {

        axios.get(`http://localhost:8080/currency`).then(response => {

            let currencyMap = response.data;
            this.state.axialMap["0,0"].current.setTextWithFontSize(currencyMap.base, 20);
            let centralTextBlockColor = currencyColors[currencyMap.base].color;
            centralTextBlockColor = LightenDarkenColor(centralTextBlockColor, 0);
            this.state.axialMap["0,0"].current.setColor(centralTextBlockColor, centralTextBlockColor, centralTextBlockColor);

            let rateMap = {};

            currencyMap.rates.forEach(rate => {
                rateMap[rate.entity] = rate
            });

            let unitedStatesDollar = rateMap["USD"];
            let euro = rateMap["EUR"];
            let poundSterling = rateMap["GBP"];
            let canadianDollar = rateMap["CAD"];
            let swissFranc = rateMap["CHF"];
            let newZealandDollar = rateMap["NZD"];

            let strokeColorNegativity = -90;
            let innerFillColorNegativity = 0;

            this.renderDirection(unitedStatesDollar.entity, 1, -2, unitedStatesDollar.value, directions.NORTH, this.state.maxPolygonGroupMemberCount,
                '#ffffff', LightenDarkenColor(currencyColors["USD"].color, strokeColorNegativity), LightenDarkenColor(currencyColors["USD"].color, innerFillColorNegativity), this.state.axialMap);

            this.renderDirection(euro.entity, 2, -1, euro.value, directions.NORTHEAST, this.state.maxPolygonGroupMemberCount,
                '#ffffff', LightenDarkenColor(currencyColors["EUR"].color, strokeColorNegativity), LightenDarkenColor(currencyColors["EUR"].color, innerFillColorNegativity), this.state.axialMap);

            this.renderDirection(poundSterling.entity, 1, 1, poundSterling.value, directions.SOUTHEAST, this.state.maxPolygonGroupMemberCount,
                '#ffffff', LightenDarkenColor(currencyColors["GBP"].color, strokeColorNegativity), LightenDarkenColor(currencyColors["GBP"].color, innerFillColorNegativity), this.state.axialMap);

            this.renderDirection(canadianDollar.entity, -1, 2, canadianDollar.value, directions.SOUTH, this.state.maxPolygonGroupMemberCount,
                '#ffffff', LightenDarkenColor(currencyColors["CAD"].color, strokeColorNegativity), LightenDarkenColor(currencyColors["CAD"].color, innerFillColorNegativity), this.state.axialMap);

            this.renderDirection(swissFranc.entity, -2, 1, swissFranc.value, directions.SOUTHWEST, this.state.maxPolygonGroupMemberCount,
                '#ffffff', LightenDarkenColor(currencyColors["CHF"].color, strokeColorNegativity), LightenDarkenColor(currencyColors["CHF"].color, innerFillColorNegativity), this.state.axialMap);

            this.renderDirection(newZealandDollar.entity, -1, -1, newZealandDollar.value, directions.NORTHWEST, this.state.maxPolygonGroupMemberCount,
                '#ffffff', LightenDarkenColor(currencyColors["NZD"].color, strokeColorNegativity), LightenDarkenColor(currencyColors["NZD"].color, innerFillColorNegativity), this.state.axialMap);
        });


    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    callbackFunction = (childData) => {
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
                                            parentCallback={this.callbackFunction}
                                            ref={this.state.axialMap[element]}
                                            polygon={this.state.defaultUnitPolygon}
                                        />)
                                    }</div>
                                } else {
                                    return <div style={{
                                        marginTop: -this.state.topMargin,
                                        marginBottom: -this.state.topMargin
                                    }}>{

                                        row.map((element) => <RegularConvexPolygon
                                            parentCallback={this.callbackFunction}
                                            ref={this.state.axialMap[element]}
                                            polygon={this.state.defaultUnitPolygon}
                                        />)
                                    }</div>
                                }
                            else {
                                return <div
                                    style={{
                                        marginLeft: this.state.leftMargin, marginTop: -this.state.topMargin,
                                        marginBottom: -this.state.topMargin
                                    }}>{
                                    row.map((element) => <RegularConvexPolygon
                                        parentCallback={this.callbackFunction}
                                        ref={this.state.axialMap[element]}
                                        polygon={this.state.defaultUnitPolygon}
                                    />)
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