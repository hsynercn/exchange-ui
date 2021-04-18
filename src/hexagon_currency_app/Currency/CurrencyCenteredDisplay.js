import {useEffect, useState} from "react";
import {getRadialExpansionSequence, initHexagonPolygonCenteredGrid} from "../Util/HexagonGridUtils";
import PolygonGroup from "../Polygon/PolygonGroup";
import {getCurrencyColor} from "../../CurrencyColors";
import {
    ClockwiseHexagonDirections,
    ClockwiseHexagonRegions,
    Directions, getDirectionalOrientations,
    getRegionalOrientations,
    HexagonalDisplayType
} from "../Util/PolygonUtil";
import {detailedNumberFormatter, getDiagonalStepValue, largeNumberFormatter} from "../Util/NumberFormattingUtil";
import {LightenDarkenColor} from "../Util/ColorUtil";

function formatDailyChangeString(currency) {
    let changeDataString = "";
    if (currency.dailyChange > 0) {
        changeDataString = "+" + detailedNumberFormatter(currency.dailyChange) +
            "(+" + largeNumberFormatter(currency.dailyChangeRate * 100) + "%)";
    } else {
        changeDataString = detailedNumberFormatter(currency.dailyChange) +
            "(" + largeNumberFormatter(currency.dailyChangeRate * 100) + "%)";
    }
    return changeDataString;
}

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

        let type = props.type;
        let sourceCurrencyEntity = currencyVisualizationData.sourceCurrency.entity;
        let destinationCurrencies = currencyVisualizationData.destinationCurrencies;

        if (sourceCurrencyEntity === "") {
            return;
        }
        let clonedAxialMap = {...axialMap};

        Object.keys(clonedAxialMap).forEach(function(key) {
            clonedAxialMap[key].text = defaultUnitPolygon.text;
            clonedAxialMap[key].fillColor = defaultUnitPolygon.fillColor;
            clonedAxialMap[key].strokeColor = defaultUnitPolygon.strokeColor;
            clonedAxialMap[key].innerFillColor = defaultUnitPolygon.innerFillColor;
        });

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
        } else if (type === HexagonalDisplayType.BASIC_CENTERED) {

            let directionalOrientations = getDirectionalOrientations(orientationX, orientationY);

            let mainColor = "#cacaca";

            let centralTextBlockColor = getCurrencyColor(sourceCurrencyEntity);
            let centerPolygonCoordinate = directionalOrientations[Directions.CENTER].x + "," + directionalOrientations[Directions.CENTER].y;
            clonedAxialMap[centerPolygonCoordinate].fillColor = mainColor;
            clonedAxialMap[centerPolygonCoordinate].strokeColor = mainColor;
            clonedAxialMap[centerPolygonCoordinate].innerFillColor = mainColor;
            clonedAxialMap[centerPolygonCoordinate].text = sourceCurrencyEntity;


            destinationCurrencies.forEach((currency, index) => {
                let direction = ClockwiseHexagonDirections[index];
                let polygonCoordinate = directionalOrientations[direction].x + "," + directionalOrientations[direction].y;
                let displayValue = currency.value;

                let currencyText = currency.entity;
                let fillColor = mainColor;
                let strokeColor = mainColor;
                let innerFillColor = strokeColor;
                let textBlockColor = LightenDarkenColor(innerFillColor, 30);

                if(displayValue !== 0) {
                    let currencyValueString = detailedNumberFormatter(displayValue);
                    let changeDataString = formatDailyChangeString(currency);
                    clonedAxialMap[polygonCoordinate].text =
                        currencyText + "/" + sourceCurrencyEntity + "\n"
                        + currencyValueString + "\n"
                        + changeDataString;
                } else {
                    clonedAxialMap[polygonCoordinate].text =
                        "\n  " + currencyText + "/" + sourceCurrencyEntity + "  \n";
                }
                clonedAxialMap[polygonCoordinate].strokeColor = strokeColor;
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