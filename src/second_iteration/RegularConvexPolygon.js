import React, {useState} from 'react'
import PolygonUtils from "./PolygonUtil";

const useRegularConvexPolygon = (props) => {

    const [widthRatio, setWidthRatio] = useState(props.widthRatio);
    const [radius, setRadius] = useState(30);
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

    const tempGeneratedPoints = PolygonUtils.generatePoints(
        numSides,
        radius,
        centerAng,
        startAngle);

    let generatedPointsOuter = PolygonUtils.generatePoints(
        numSides,
        radius + edgeOffsetLen,
        centerAng,
        startAngle);

    const tempGeneratedPointsInner = PolygonUtils.generatePoints(
        numSides,
        (radius + edgeOffsetLen) * innerPolygonRatio,
        centerAng,
        startAngle);


    const [edges, setEdges] = useState(PolygonUtils.getEdgePoints(generatedPointsOuter));
    let dimensions = PolygonUtils.getDimensions(edges);

    const [generatedPoints, setGeneratedPoints] = useState(PolygonUtils.getShiftedPositiveQuadrant(tempGeneratedPoints, edges));
    const [generatedPointsInner, setGeneratedPointsInner] = useState(PolygonUtils.getShiftedPositiveQuadrant(tempGeneratedPointsInner, edges));


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
            numSides,
            (radius + edgeOffsetLen) * ratio,
            centerAng,
            startAngle);
        generatedPointsInner = PolygonUtils.getShiftedPositiveQuadrant(generatedPointsInner, edges);
        let polygonCoordinatesInner = generatedPointsInner.map(pair => pair.join(',')).join(' ');
        setGeneratedPointsInner(generatedPointsInner);
        setInnerPolygonRatio(ratio);
        setPolygonCoordinatesInner(polygonCoordinatesInner);
    }

    return {
        widthRatio,
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
        widthRatio,
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
            width={(widthRatio * 100) + "%"}
            viewBox={"0 0 " + xDim + " " + yDim}
            style={{verticalAlign: 'top'}}
        >
            <polygon points={polygonCoordinates} style={{
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: (100 * edgeOffsetRatio) + "%",
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

export default RegularConvexPolygon;