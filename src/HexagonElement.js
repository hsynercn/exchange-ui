import React from "react";
import axios from 'axios';
import {currencyColors} from './CurrencyColors'
import PolygonUtils, {Directions} from "./second_iteration/PolygonUtil";
import {LightenDarkenColor} from "./second_iteration/ColorUtil";

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

        let generatedPoints = PolygonUtils.generatePoints(
            this.state.numSides,
            this.state.radius,
            this.state.centerAng,
            this.state.startAngle);

        let generatedPointsOuter = PolygonUtils.generatePoints(
            this.state.numSides,
            this.state.radius + this.state.edgeOffsetLen,
            this.state.centerAng,
            this.state.startAngle);

        let generatedPointsInner = PolygonUtils.generatePoints(
            this.state.numSides,
            (this.state.radius + this.state.edgeOffsetLen) * this.state.innerPolygonRatio,
            this.state.centerAng,
            this.state.startAngle);

        this.state.edges = PolygonUtils.getEdgePoints(generatedPointsOuter);

        generatedPoints = PolygonUtils.getShiftedPositiveQuadrant(generatedPoints, this.state.edges);
        let dimensions = PolygonUtils.getDimensions(this.state.edges);

        generatedPointsInner = PolygonUtils.getShiftedPositiveQuadrant(generatedPointsInner, this.state.edges);

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
        let generatedPointsInner = PolygonUtils.generatePoints(
            this.state.numSides,
            (this.state.radius + this.state.edgeOffsetLen) * ratio,
            this.state.centerAng,
            this.state.startAngle);
        generatedPointsInner = PolygonUtils.getShiftedPositiveQuadrant(generatedPointsInner, this.state.edges);
        let polygonCoordinatesInner = generatedPointsInner.map(pair => pair.join(',')).join(' ');
        this.setState({innerPolygonRatio: ratio, polygonCoordinatesInner: polygonCoordinatesInner});
    }

    render() {

        return (
            <svg
                height={this.state.yDim}
                width={this.state.xDim}
                style={{verticalAlign: 'top'}}
            >
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
                      fill="black" fontSize={this.state.textFontSize} fontWeight="normal">
                    {this.state.text}
                </text>
            </svg>
        );
    }
}

class PolygonSample extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            polygonCountLength: 15,
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
                strokeColor: '#aeaeae',
                text: "",
                textFontSize: 14,
                innerPolygonRatio: 0.0,
                innerFillColor: "",
            },
            axialPolygonMap: {},
            maxPolygonGroupMemberCount: 15,
            unitPolygonXDim: 0,
            unitPolygonYDim: 0,
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
        if (direction === Directions.NORTH || direction === Directions.NORTHEAST || direction === Directions.NORTHWEST) {
            factor = 1;
        } else {
            factor = -1;
            refX = -refX;
            refY = -refY;
        }

        let x = refX;
        let y = refY;

        if (direction === Directions.NORTH || direction === Directions.SOUTH) {
            for (let i = 1; tmpCount < polygonCount; i++) {
                x = refX;
                for (let j = 1; j <= i && tmpCount < polygonCount; j++) {
                    sequence.push(factor * x + "," + factor * y);
                    x++;
                    tmpCount++;
                }
                y--;
            }
        } else if (direction === Directions.NORTHEAST || direction === Directions.SOUTHWEST) {
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
        } else if (direction === Directions.NORTHWEST || direction === Directions.SOUTHEAST) {
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

    largeNumberFormatter(value) {

        var expression = ["", "K", "M", "G", "T", "P", "E"];

        let practicalLimit = 6;
        let valueScale = 0;

        while (value >= 1000 && valueScale < practicalLimit) {
            value = value / 1000;
            valueScale++;
        }
        let decimalDigit = value % 1 === 0 ? 1 : 2;
        return value.toFixed(decimalDigit) + expression[valueScale];
    }

    renderDirection(currencyText, startX, startY, displayValue, direction, maxPolygonGroupMemberCount, fillColor, strokeColor, innerFillColor, axialMap) {
        let sequence = this.getSequence(startX, startY, maxPolygonGroupMemberCount, direction);

        let digitCount = Math.max(Math.floor(Math.log10(Math.abs(displayValue))), 0) + 1;

        let largestDivider = Math.pow(10, digitCount - 1);

        displayValue = displayValue.toFixed(2);

        let stepValue = largestDivider;

        let segmentCount = Math.ceil(displayValue / stepValue);
        let sum = 0;
        segmentCount = segmentCount > maxPolygonGroupMemberCount ? maxPolygonGroupMemberCount : segmentCount;

        axialMap[sequence[0]].current.setTextWithFontSize(currencyText, 20);
        let textBlockColor = LightenDarkenColor(innerFillColor, 30);
        axialMap[sequence[0]].current.setColor(textBlockColor, textBlockColor, textBlockColor);

        for (let i = 1; i < (segmentCount + 1); i++) {
            if (displayValue < stepValue) {
                axialMap[sequence[i]].current.setText(this.largeNumberFormatter(sum + displayValue));
                axialMap[sequence[i]].current.setColor(fillColor, strokeColor, innerFillColor);
                axialMap[sequence[i]].current.setInnerPolygonRatio(displayValue / stepValue);
            } else {
                sum += stepValue;
                axialMap[sequence[i]].current.setText(this.largeNumberFormatter(sum));
                axialMap[sequence[i]].current.setColor(innerFillColor, strokeColor, innerFillColor);
                displayValue -= stepValue;
            }
        }
    }

    getOrientations(offsetX, offsetY) {
        let orientationOffset = {
        }
        orientationOffset[Directions.NORTH] = {x:offsetX+1, y:offsetY-2};
        orientationOffset[Directions.NORTHEAST] = {x:offsetX+2, y:offsetY-1};
        orientationOffset[Directions.SOUTHEAST] = {x:offsetX+1, y:offsetY+1};
        orientationOffset[Directions.SOUTH] = {x:offsetX-1, y:offsetY+2};
        orientationOffset[Directions.SOUTHWEST] = {x:offsetX-2, y:offsetY+1};
        orientationOffset[Directions.NORTHWEST] = {x:offsetX-1, y:offsetY-1};
        orientationOffset[Directions.CENTER] = {x:offsetX, y:offsetY};
        return orientationOffset;
    }

    componentDidMount() {

        axios.get(`http://localhost:8080/currency`).then(response => {

            let startPoints = this.getOrientations(-1,0);

            let currencyMap = response.data;

            let centerPolygon = this.state.axialMap[startPoints[Directions.CENTER].x +"," + startPoints[Directions.CENTER].y];

            centerPolygon.current.setTextWithFontSize(currencyMap.base, 20);
            let centralTextBlockColor = currencyColors[currencyMap.base].color;
            centralTextBlockColor = LightenDarkenColor(centralTextBlockColor, 0);

            centerPolygon.current.setColor(centralTextBlockColor, centralTextBlockColor, centralTextBlockColor);

            let rateMap = {};

            currencyMap.rates.forEach(rate => {
                rateMap[rate.entity] = rate
            });

            let northCurrency = "USD";
            let northEastCurrency = "EUR";
            let southEastCurrency = "GBP";
            let southCurrency = "CAD";
            let southWestCurrency = "ETH";
            let northWestCurrency = "BTC";


            this.renderDirection(rateMap[northCurrency].entity, startPoints[Directions.NORTH].x, startPoints[Directions.NORTH].y, rateMap[northCurrency].value, Directions.NORTH, this.state.maxPolygonGroupMemberCount,
                '#ffffff', currencyColors[northCurrency].color, currencyColors[northCurrency].color, this.state.axialMap);

            this.renderDirection(rateMap[northEastCurrency].entity, startPoints[Directions.NORTHEAST].x, startPoints[Directions.NORTHEAST].y, rateMap[northEastCurrency].value, Directions.NORTHEAST, this.state.maxPolygonGroupMemberCount,
                '#ffffff', currencyColors[northEastCurrency].color, currencyColors[northEastCurrency].color, this.state.axialMap);

            this.renderDirection(rateMap[southEastCurrency].entity, startPoints[Directions.SOUTHEAST].x, startPoints[Directions.SOUTHEAST].y, rateMap[southEastCurrency].value, Directions.SOUTHEAST, this.state.maxPolygonGroupMemberCount,
                '#ffffff', currencyColors[southEastCurrency].color, currencyColors[southEastCurrency].color, this.state.axialMap);

            this.renderDirection(rateMap[southCurrency].entity, startPoints[Directions.SOUTH].x, startPoints[Directions.SOUTH].y, rateMap[southCurrency].value, Directions.SOUTH, this.state.maxPolygonGroupMemberCount,
                '#ffffff', currencyColors[southCurrency].color, currencyColors[southCurrency].color, this.state.axialMap);

            this.renderDirection(rateMap[southWestCurrency].entity, startPoints[Directions.SOUTHWEST].x, startPoints[Directions.SOUTHWEST].y, rateMap[southWestCurrency].value, Directions.SOUTHWEST, this.state.maxPolygonGroupMemberCount,
                '#ffffff', currencyColors[southWestCurrency].color, currencyColors[southWestCurrency].color, this.state.axialMap);

            this.renderDirection(rateMap[northWestCurrency].entity, startPoints[Directions.NORTHWEST].x, startPoints[Directions.NORTHWEST].y, rateMap[northWestCurrency].value, Directions.NORTHWEST, this.state.maxPolygonGroupMemberCount,
                '#ffffff', currencyColors[northWestCurrency].color, currencyColors[northWestCurrency].color, this.state.axialMap);
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
                axialMap: this.state.axialMap,
                unitPolygonXDim: childData.xDim,
                unitPolygonYDim: childData.yDim,
            });
        }
    }

    render() {
        return (
            <div style={{
                width: ( this.state.leftMargin + this.state.unitPolygonXDim * this.state.polygonCountLength)+"px",
                height: (this.state.topMargin + ((this.state.polygonCountHeight+1)/2 + (this.state.polygonCountHeight-1)/4)*this.state.unitPolygonYDim) + "px",
                //overflowX: "auto",
                overflowY: "hidden",
                margin:"0 auto"
            }}>
                {
                    this.state.axialArray.map((row, index) => {

                            let dynamicStyle = {};
                            if (index % 2 === 0) {
                                if (index === 0) {
                                    dynamicStyle = {
                                        marginBottom: -this.state.topMargin
                                    };
                                } else {
                                    dynamicStyle = {
                                        marginTop: -this.state.topMargin,
                                        marginBottom: -this.state.topMargin
                                    };
                                }
                            } else {
                                dynamicStyle = {
                                    marginLeft: this.state.leftMargin,
                                    marginTop: -this.state.topMargin,
                                    marginBottom: -this.state.topMargin
                                };
                            }

                            return <div
                                style={dynamicStyle}>{
                                row.map((element) => <RegularConvexPolygon
                                    parentCallback={this.callbackFunction}
                                    ref={this.state.axialMap[element]}
                                    polygon={this.state.defaultUnitPolygon}
                                />)
                            }</div>
                        }
                    )
                }
            </div>
        );
    }
}

export default PolygonSample;