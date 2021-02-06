import React, {useState} from 'react'
import PolygonUtils from "./PolygonUtil";

const useRegularConvexPolygon = (props) => {

    const [radius, setRadius] = useState(props.radius);
    const [edgeOffsetRatio, setEdgeOffsetRatio] = useState(props.edgeOffsetRatio);
    const [startAngle, setStartAngle] = useState(props.startAngle);
    const [numSides, setNumSides] = useState(props.numSides);
    const [fillColor, setFillColor] = useState(props.fillColor);
    const [strokeColor, setStrokeColor] = useState(props.strokeColor);
    const [text, setText] = useState(props.text);
    const [textFontSize, setTextFontSize] = useState(props.textFontSize);
    const [innerPolygonRatio, setInnerPolygonRatio] = useState(props.innerPolygonRatio);
    const [innerFillColor, setInnerFillColor] = useState(props.innerFillColor);

    const [centerAng, setCenterAng] = useState(2 * Math.PI / numSides);
    const [edgeOffsetLen, setEdgeOffsetLen] = useState(radius * edgeOffsetRatio / 2);

    const [generatedPoints, setGeneratedPoints] = useState(PolygonUtils.generatePoints(
        numSides,
        radius,
        centerAng,
        startAngle));

    let generatedPointsOuter = PolygonUtils.generatePoints(
        numSides,
        radius + edgeOffsetLen,
        centerAng,
        startAngle);

    const [generatedPointsInner, setGeneratedPointsInner] = useState(PolygonUtils.generatePoints(
        numSides,
        (radius + edgeOffsetLen) * innerPolygonRatio,
        centerAng,
        startAngle));


    const [edges, setEdges] = useState(PolygonUtils.getEdgePoints(generatedPointsOuter));
    let dimensions = PolygonUtils.getDimensions(this.state.edges);

    this.state.polygonCoordinates = polygonCoordinates;
    this.state.polygonCoordinatesInner = polygonCoordinatesInner;

    setGeneratedPoints(PolygonUtils.getShiftedPositiveQuadrant(generatedPoints, edges));
    setGeneratedPointsInner(PolygonUtils.getShiftedPositiveQuadrant(generatedPointsInner, edges));

    const [polygonCoordinates, setPolygonCoordinates] = useState(generatedPoints.map(pair => pair.join(',')).join(' '));
    const [polygonCoordinatesInner, setPolygonCoordinatesInner] = useState(generatedPointsInner.map(pair => pair.join(',')).join(' '));


    const [xDim, setXDim] = useState(dimensions.xDim);
    const [yDim, setYDim] = useState(dimensions.yDim);

    const setTextWithFontSize = (text, textFontSize) => {
        setText(text);
        setTextFontSize(textFontSize);
    }

    const setColor = (fillColor, strokeColor, innerFillColor) => {
        setFillColor(fillColor);
        setStrokeColor(strokeColor);
        setInnerFillColor(innerFillColor);
    }

    const setInnerPolygonFullnessRatio = (ratio) => {

        let generatedPointsInner = PolygonUtils.generatePoints(
            this.state.numSides,
            (this.state.radius + this.state.edgeOffsetLen) * ratio,
            this.state.centerAng,
            this.state.startAngle);
        generatedPointsInner = PolygonUtils.getShiftedPositiveQuadrant(generatedPointsInner, this.state.edges);
        let polygonCoordinatesInner = generatedPointsInner.map(pair => pair.join(',')).join(' ');
        setGeneratedPointsInner(generatedPointsInner);
        setInnerPolygonRatio(ratio);
        setPolygonCoordinatesInner(polygonCoordinatesInner);
    }

    return {
        radius,
        edgeOffsetRatio,
        startAngle,
        numSides,
        centerAng,
        generatedPoints,
        edgeOffsetLen,
        edges,
        xDim,
        yDim,
        polygonCoordinates,
        polygonCoordinatesInner,
        fillColor,
        strokeColor,
        text,
        textFontSize,
        innerPolygonRatio,
        innerFillColor,
    };
}

const RegularConvexPolygon = (props) => {
    const {
        radius,
        edgeOffsetRatio,
        startAngle,
        numSides,
        centerAng,
        generatedPoints,
        edgeOffsetLen,
        edges,
        xDim,
        yDim,
        polygonCoordinates,
        polygonCoordinatesInner,
        fillColor,
        strokeColor,
        text,
        textFontSize,
        innerPolygonRatio,
        innerFillColor,
    } = useRegularConvexPolygon(props);

    return (
        <svg
            height={yDim}
            width={xDim}
            style={{verticalAlign: 'top'}}
        >
            <polygon points={polygonCoordinates} style={{
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: radius * edgeOffsetRatio,
                verticalAlign: 'top'
            }}/>
            <polygon points={polygonCoordinatesInner} style={{
                fill: innerFillColor,
                verticalAlign: 'top'
            }}/>
            <text x="50%" y="57%" style={{whiteSpace: "pre-line"}} textAnchor="middle" fontFamily="Arial"
                  fill="black" fontSize={textFontSize} fontWeight="normal">
                {text}
            </text>
        </svg>
    );
}