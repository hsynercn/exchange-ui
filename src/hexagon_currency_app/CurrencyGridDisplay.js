import PolygonGroup from "./PolygonGroup";
import React, {useEffect, useState} from "react";
import {ClockwiseHexagonDirections, Directions, getOrientations} from "./PolygonUtil";
import {getCurrencyColor} from "../CurrencyColors";
import {centeredHexagonPolygonGrid, getRadialExpansionSequence} from "./HexagonGridUtils";
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

    function prepareCenterPolygon(sourceCurrencyEntity, startPoints, clonedAxialMap) {
        let centralTextBlockColor = getCurrencyColor(sourceCurrencyEntity);
        let centerPolygonCoordinate = startPoints[Directions.CENTER].x + "," + startPoints[Directions.CENTER].y;
        clonedAxialMap[centerPolygonCoordinate].fillColor = centralTextBlockColor;
        clonedAxialMap[centerPolygonCoordinate].strokeColor = centralTextBlockColor;
        clonedAxialMap[centerPolygonCoordinate].innerFillColor = centralTextBlockColor;
        clonedAxialMap[centerPolygonCoordinate].text = sourceCurrencyEntity;
    }

    useEffect(() => {

        let currencyVisualizationData = props.currencyVisualizationData;

        let type = currencyVisualizationData.type;
        let sourceCurrencyEntity = currencyVisualizationData.sourceCurrency.entity;
        let destinationCurrencies = currencyVisualizationData.destinationCurrencies;

        if (sourceCurrencyEntity === "") {
            return;
        }
        let clonedAxialMap = {...axialMap};

        let startPoints = getOrientations(orientationX, orientationY);

        prepareCenterPolygon(sourceCurrencyEntity, startPoints, clonedAxialMap);


        if (type === "radial") {
            destinationCurrencies.forEach((currency, index) => {
                let direction = ClockwiseHexagonDirections[index];
                let polygonCoordinateSequence = getRadialExpansionSequence(startPoints[direction].x, startPoints[direction].y, direction);
                let displayValue = currency.value;
                let stepValue = getDiagonalStepValue(displayValue, floatNumFault);

                let currencyText = currency.entity;
                let fillColor = '#ffffff';
                let strokeColor = LightenDarkenColor(getCurrencyColor(currency.entity), -20);
                let innerFillColor = getCurrencyColor(currency.entity);
                let textBlockColor = LightenDarkenColor(innerFillColor, 30);

                let sum = 0;
                polygonCoordinateSequence.forEach((polygonCoordinate, index) => {
                    if (index === 0) {
                        clonedAxialMap[polygonCoordinate].textFontSize = 20;
                        clonedAxialMap[polygonCoordinate].text = currencyText;
                        clonedAxialMap[polygonCoordinate].fillColor = textBlockColor;
                        clonedAxialMap[polygonCoordinate].strokeColor = strokeColor;
                        clonedAxialMap[polygonCoordinate].innerFillColor = textBlockColor;
                    } else if (displayValue !== 0) {
                        if (displayValue < stepValue) {
                            clonedAxialMap[polygonCoordinate].text = largeNumberFormatter(sum + displayValue);
                            clonedAxialMap[polygonCoordinate].fillColor = fillColor;
                            clonedAxialMap[polygonCoordinate].strokeColor = strokeColor;
                            clonedAxialMap[polygonCoordinate].innerFillColor = innerFillColor;
                            let innerPolygonRatio = displayValue / stepValue;
                            clonedAxialMap[polygonCoordinate].innerPolygonRatio = innerPolygonRatio;
                            displayValue = 0;
                        } else {
                            sum += stepValue;
                            clonedAxialMap[polygonCoordinate].text = largeNumberFormatter(sum);
                            clonedAxialMap[polygonCoordinate].fillColor = innerFillColor;
                            clonedAxialMap[polygonCoordinate].strokeColor = strokeColor;
                            clonedAxialMap[polygonCoordinate].innerFillColor = innerFillColor;
                            displayValue -= stepValue;
                        }
                    } else {
                        clonedAxialMap[polygonCoordinate].text = "";
                        clonedAxialMap[polygonCoordinate].fillColor = defaultUnitPolygon.fillColor;
                        clonedAxialMap[polygonCoordinate].strokeColor = defaultUnitPolygon.strokeColor;
                        clonedAxialMap[polygonCoordinate].innerFillColor = defaultUnitPolygon.innerFillColor;
                        clonedAxialMap[polygonCoordinate].innerPolygonRatio = defaultUnitPolygon.innerPolygonRatio;
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