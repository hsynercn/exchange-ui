import PolygonGroup from "./PolygonGroup";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {ClockwiseHexagonDirections, Directions, getOrientations} from "./PolygonUtil";
import {currencyColors} from "../CurrencyColors";
import {centeredHexagonPolygonGrid, getRadialExpansionLimit, getRadialExpansionSequence} from "./HexagonGridUtils";
import {getDiagonalStepValue, largeNumberFormatter} from "./NumberFormattingUtil";
import {LightenDarkenColor} from "./ColorUtil";

const useCurrencyDisplay = (props) => {
    const [polygonCountLength, setPolygonCountLength] = useState(props.polygonCountLength);
    const [polygonCountHeight, setPolygonCountHeight] = useState(props.polygonCountHeight);
    const [defaultUnitPolygon, setDefaultUnitPolygon] = useState(props.defaultUnitPolygon);

    let {tempAxialArray, tempAxialMap} = centeredHexagonPolygonGrid(polygonCountLength, polygonCountHeight, defaultUnitPolygon);

    const [axialArray, setAxialArray] = useState(tempAxialArray);
    const [axialMap, setAxialMap] = useState(tempAxialMap);

    const [displayConfiguration, setDisplayConfiguration] = useState({
        type: "radial",
        currencyList: ["USD", "EUR", "GBP", "CAD", "ETH", "BTC"]
    });

    const [customizedPolygons, setCustomizedPolygons] = useState([]);
    const [orientationX, setOrientationX] = useState(0);
    const [orientationY, setOrientationY] = useState(0);
    const [floatNumFault, setFloatNumFault] = useState(2);

    useEffect(() => {
        axios.get(`http://localhost:8080/currency`).then(response => {
            let currencyMap = response.data;
            let startPoints = getOrientations(orientationX, orientationY);
            let centralTextBlockColor = currencyColors[currencyMap.base].color;
            let centerPolygonCoordinate = startPoints[Directions.CENTER].x + "," + startPoints[Directions.CENTER].y;

            let clonedAxialMap = {...axialMap};
            clonedAxialMap[centerPolygonCoordinate].fillColor = centralTextBlockColor;
            clonedAxialMap[centerPolygonCoordinate].strokeColor = centralTextBlockColor;
            clonedAxialMap[centerPolygonCoordinate].innerFillColor = centralTextBlockColor;
            clonedAxialMap[centerPolygonCoordinate].text = currencyMap.base;

            let rateMap = {};
            currencyMap.rates.forEach(rate => {
                rateMap[rate.entity] = rate
            });

            if (displayConfiguration.type === "radial") {
                displayConfiguration.currencyList.forEach((currency, index) => {
                    let direction = ClockwiseHexagonDirections[index];
                    let polygonCoordinateSequence = getRadialExpansionSequence(startPoints[direction].x, startPoints[direction].y, direction);
                    let displayValue = rateMap[currency].value;
                    let stepValue = getDiagonalStepValue(displayValue, floatNumFault);
                    let segmentCount = Math.ceil(displayValue / stepValue);

                    segmentCount = Math.min(segmentCount, getRadialExpansionLimit());

                    let currencyText = rateMap[currency].entity;
                    let fillColor = '#ffffff';
                    let strokeColor = LightenDarkenColor(currencyColors[currency].color, -20);
                    let innerFillColor = currencyColors[currency].color;
                    let textBlockColor = LightenDarkenColor(innerFillColor, 30);

                    let sum = 0;
                    polygonCoordinateSequence.forEach((polygonCoordinate, index) => {
                        if (index === 0) {
                            clonedAxialMap[polygonCoordinate].textFontSize = 20;
                            clonedAxialMap[polygonCoordinate].text = currencyText;
                            clonedAxialMap[polygonCoordinate].fillColor = textBlockColor;
                            clonedAxialMap[polygonCoordinate].strokeColor = textBlockColor;
                            clonedAxialMap[polygonCoordinate].innerFillColor = textBlockColor;
                        } else if (displayValue !== 0) {
                            if (displayValue < stepValue) {
                                axialMap[polygonCoordinate].text = largeNumberFormatter(sum + displayValue);
                                axialMap[polygonCoordinate].fillColor = fillColor;
                                axialMap[polygonCoordinate].strokeColor = strokeColor;
                                axialMap[polygonCoordinate].innerFillColor = innerFillColor;
                                let innerPolygonRatio = displayValue / stepValue;
                                axialMap[polygonCoordinate].innerPolygonRatio = innerPolygonRatio;
                                displayValue = 0;
                            } else {
                                sum += stepValue;
                                axialMap[polygonCoordinate].text = largeNumberFormatter(sum);
                                axialMap[polygonCoordinate].fillColor = innerFillColor;
                                axialMap[polygonCoordinate].strokeColor = strokeColor;
                                axialMap[polygonCoordinate].innerFillColor = innerFillColor;
                                displayValue -= stepValue;
                            }
                        }
                    });
                });
            }
            setAxialMap(clonedAxialMap);

        });
    }, []);
    return {polygonCountLength, polygonCountHeight, defaultUnitPolygon, customizedPolygons, axialArray, axialMap};
}

const CurrencyDisplay = (props) => {
    const {
        polygonCountLength,
        polygonCountHeight,
        defaultUnitPolygon,
        customizedPolygons,
        axialArray,
        axialMap,
    } = useCurrencyDisplay(props);


    return (
        <>
            <PolygonGroup
                polygonCountLength={polygonCountLength}
                polygonCountHeight={polygonCountHeight}
                customizedPolygons={customizedPolygons}
                axialArray={axialArray}
                axialMap={axialMap}
                defaultUnitPolygon={{
                    edgeOffsetRatio: 0.036,
                    startAngle: 90,
                    numSides: 6,
                    fillColor: '#ffffff',
                    strokeColor: '#000000',
                    text: "",
                    textFontSize: 14,
                    innerPolygonRatio: 0.0,
                    innerFillColor: "",
                }}
            />
        </>
    );

}
export default CurrencyDisplay;