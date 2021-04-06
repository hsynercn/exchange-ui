import {useEffect, useState} from "react";
import {getRadialExpansionSequence, initHexagonPolygonCenteredGrid} from "./HexagonGridUtils";
import PolygonGroup from "./PolygonGroup";
import {getCurrencyColor} from "../CurrencyColors";
import {
    ClockwiseHexagonDirections,
    ClockwiseHexagonRegions,
    Directions, getDirectionalOrientations,
    getRegionalOrientations,
    HexagonalDisplayType
} from "./PolygonUtil";
import {getDiagonalStepValue, largeNumberFormatter} from "./NumberFormattingUtil";
import {LightenDarkenColor} from "./ColorUtil";

const useCurrencyCenteredDisplay = (props) => {
    const [edgeLength, setEdgeLength] = useState(props.edgeLength);
    const [defaultUnitPolygon, setDefaultUnitPolygon] = useState(props.defaultUnitPolygon);

    let {tempAxialArray, tempAxialMap} = initHexagonPolygonCenteredGrid(edgeLength, defaultUnitPolygon);

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



        if (type === HexagonalDisplayType.RADIAL_CENTERED) {

            let regionalOrientations = getRegionalOrientations(orientationX, orientationY);

            prepareCenterPolygon(sourceCurrencyEntity, regionalOrientations, clonedAxialMap);

            destinationCurrencies.forEach((currency, index) => {
                let direction = ClockwiseHexagonRegions[index];
                let polygonCoordinateSequence = getRadialExpansionSequence(regionalOrientations[direction].x, regionalOrientations[direction].y, direction);
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
                        //clonedAxialMap[polygonCoordinate].textFontSize = 20;
                        clonedAxialMap[polygonCoordinate].text = currencyText + "\n" + "/" + sourceCurrencyEntity;
                        clonedAxialMap[polygonCoordinate].fillColor = textBlockColor;
                        clonedAxialMap[polygonCoordinate].strokeColor = textBlockColor;
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
        } else if(type === HexagonalDisplayType.BASIC_CENTERED) {

            let directionalOrientations = getDirectionalOrientations(orientationX, orientationY);

            prepareCenterPolygon(sourceCurrencyEntity, directionalOrientations, clonedAxialMap);

            destinationCurrencies.forEach((currency, index) => {
                let direction = ClockwiseHexagonDirections[index];
                let polygonCoordinate = directionalOrientations[direction].x + "," + directionalOrientations[direction].y;
                let displayValue = currency.value;

                let currencyText = currency.entity;
                let fillColor = '#ffffff';
                let strokeColor = LightenDarkenColor(getCurrencyColor(currency.entity), -20);
                let innerFillColor = getCurrencyColor(currency.entity);
                let textBlockColor = LightenDarkenColor(innerFillColor, 30);

                clonedAxialMap[polygonCoordinate].text =
                    currencyText + "/" + sourceCurrencyEntity + "\n"
                    + largeNumberFormatter(displayValue) + "\n"
                    + currency.dailyChange.toFixed(4);
                //clonedAxialMap[polygonCoordinate].text = currencyText + "\n" + "/" + sourceCurrencyEntity;
                clonedAxialMap[polygonCoordinate].fillColor = innerFillColor;
                clonedAxialMap[polygonCoordinate].strokeColor = strokeColor;
                clonedAxialMap[polygonCoordinate].innerFillColor = innerFillColor;

                /*

                let sum = 0;
                polygonCoordinateSequence.forEach((polygonCoordinate, index) => {
                    if (index === 0) {
                        //clonedAxialMap[polygonCoordinate].textFontSize = 20;
                        clonedAxialMap[polygonCoordinate].text = currencyText + "\n" + "/" + sourceCurrencyEntity;
                        clonedAxialMap[polygonCoordinate].fillColor = textBlockColor;
                        clonedAxialMap[polygonCoordinate].strokeColor = textBlockColor;
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

                */

            });
        }
        setAxialMap(clonedAxialMap);

    }, [props]);

    return {
        edgeLength,
        customizedPolygons,
        axialArray,
        axialMap
    };
}

const CurrencyCenteredDisplay = (props) => {
    const {
        edgeLength,
        customizedPolygons,
        axialArray,
        axialMap
    } = useCurrencyCenteredDisplay(props);

    return (
        <>
            <PolygonGroup
                polygonCountLength={2 * edgeLength - 1}
                polygonCountHeight={2 * edgeLength - 1}
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
export default CurrencyCenteredDisplay;