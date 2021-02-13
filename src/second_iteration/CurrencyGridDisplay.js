import PolygonGroup from "./PolygonGroup";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {ClockwiseHexagonDirections, Directions, getOrientations} from "./PolygonUtil";
import {currencyColors} from "../CurrencyColors";
import {centeredHexagonPolygonGrid, getRadialExpansionLimit, getRadialExpansionSequence} from "./HexagonGridUtils";
import {getDiagonalStepValue, largeNumberFormatter} from "./NumberFormattingUtil";
import {LightenDarkenColor} from "./ColorUtil";

const useCurrencyGridDisplay = (props) => {
    const [polygonCountLength, setPolygonCountLength] = useState(props.polygonCountLength);
    const [polygonCountHeight, setPolygonCountHeight] = useState(props.polygonCountHeight);
    const [defaultUnitPolygon, setDefaultUnitPolygon] = useState(props.defaultUnitPolygon);

    let {tempAxialArray, tempAxialMap} = centeredHexagonPolygonGrid(polygonCountLength, polygonCountHeight, defaultUnitPolygon);

    const [axialArray, setAxialArray] = useState(tempAxialArray);
    const [axialMap, setAxialMap] = useState(tempAxialMap);

    const [customizedPolygons, setCustomizedPolygons] = useState([]);
    const [orientationX, setOrientationX] = useState(0);
    const [orientationY, setOrientationY] = useState(0);
    const [floatNumFault, setFloatNumFault] = useState(2);

    useEffect(() => {
        let currencyVisualizationData = props.currencyVisualizationData;

        let type = currencyVisualizationData.type;
        let sourceCurrencyEntity = currencyVisualizationData.sourceCurrency.entity;
        let destinationCurrencies = currencyVisualizationData.destinationCurrencies;

        if(sourceCurrencyEntity === "") {
            return;
        }

        let startPoints = getOrientations(orientationX, orientationY);
        let centralTextBlockColor = currencyColors[sourceCurrencyEntity].color;
        let centerPolygonCoordinate = startPoints[Directions.CENTER].x + "," + startPoints[Directions.CENTER].y;

        let clonedAxialMap = {...axialMap};
        clonedAxialMap[centerPolygonCoordinate].fillColor = centralTextBlockColor;
        clonedAxialMap[centerPolygonCoordinate].strokeColor = centralTextBlockColor;
        clonedAxialMap[centerPolygonCoordinate].innerFillColor = centralTextBlockColor;
        clonedAxialMap[centerPolygonCoordinate].text = sourceCurrencyEntity;

        if (type === "radial") {
            destinationCurrencies.forEach((currency, index) => {
                let direction = ClockwiseHexagonDirections[index];
                let polygonCoordinateSequence = getRadialExpansionSequence(startPoints[direction].x, startPoints[direction].y, direction);
                let displayValue = currency.value;
                let stepValue = getDiagonalStepValue(displayValue, floatNumFault);

                let currencyText = currency.entity;
                let fillColor = '#ffffff';
                let strokeColor = LightenDarkenColor(currencyColors[currency.entity].color, -20);
                let innerFillColor = currencyColors[currency.entity].color;
                let textBlockColor = LightenDarkenColor(innerFillColor, 30);

                let sum = 0;
                polygonCoordinateSequence.forEach((polygonCoordinate, index) => {
                    let polygonModified = clonedAxialMap[polygonCoordinate];
                    if (index === 0) {
                        polygonModified.textFontSize = 20;
                        polygonModified.text = currencyText;
                        polygonModified.fillColor = textBlockColor;
                        polygonModified.strokeColor = textBlockColor;
                        polygonModified.innerFillColor = textBlockColor;
                    } else if (displayValue !== 0) {
                        if (displayValue < stepValue) {
                            polygonModified.text = largeNumberFormatter(sum + displayValue);
                            polygonModified.fillColor = fillColor;
                            polygonModified.strokeColor = strokeColor;
                            polygonModified.innerFillColor = innerFillColor;
                            let innerPolygonRatio = displayValue / stepValue;
                            polygonModified.innerPolygonRatio = innerPolygonRatio;
                            displayValue = 0;
                        } else {
                            sum += stepValue;
                            polygonModified.text = largeNumberFormatter(sum);
                            polygonModified.fillColor = innerFillColor;
                            polygonModified.strokeColor = strokeColor;
                            polygonModified.innerFillColor = innerFillColor;
                            displayValue -= stepValue;
                        }
                    }
                });
            });
        }
        setAxialMap(clonedAxialMap);

    }, [props]);
    return {polygonCountLength, polygonCountHeight, defaultUnitPolygon, customizedPolygons, axialArray, axialMap};
}

const CurrencyGridDisplay = (props) => {
    const {
        polygonCountLength,
        polygonCountHeight,
        defaultUnitPolygon,
        customizedPolygons,
        axialArray,
        axialMap,
    } = useCurrencyGridDisplay(props);


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
export default CurrencyGridDisplay;