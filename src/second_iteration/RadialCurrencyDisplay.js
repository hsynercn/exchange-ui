import PolygonGroup from "./PolygonGroup";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Directions, getOrientations} from "./PolygonUtil";
import {currencyColors} from "../CurrencyColors";
import {centeredHexagonPolygonGrid} from "./HexagonGridUtils";

const useRadialCurrencyDisplay = (props) => {
    const [polygonCountLength, setPolygonCountLength] = useState(props.polygonCountLength);
    const [polygonCountHeight, setPolygonCountHeight] = useState(props.polygonCountHeight);
    const [defaultUnitPolygon, setDefaultUnitPolygon] = useState(props.defaultUnitPolygon);

    let {tempAxialArray, tempAxialMap} = centeredHexagonPolygonGrid(polygonCountLength, polygonCountHeight, defaultUnitPolygon);

    const [axialArray, setAxialArray] = useState(tempAxialArray);
    const [axialMap, setAxialMap] = useState(tempAxialMap);

    const [customizedPolygons, setCustomizedPolygons] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/currency`).then(response => {
            let currencyMap = response.data;
            let startPoints = getOrientations(0, 0);

            let centralTextBlockColor = currencyColors[currencyMap.base].color;

            let centerPolygonCoordinate = startPoints[Directions.CENTER].x + "," + startPoints[Directions.CENTER].y;

            let clonedAxialMap = {...axialMap};
            clonedAxialMap[centerPolygonCoordinate].fillColor = "#000eff";
            clonedAxialMap[centerPolygonCoordinate].strokeColor = "#000eff";
            clonedAxialMap[centerPolygonCoordinate].innerFillColor = "#000eff";

            setAxialMap(clonedAxialMap);


        });
    }, []);
    return {polygonCountLength, polygonCountHeight, defaultUnitPolygon, customizedPolygons, axialArray, axialMap};
}

const RadialCurrencyDisplay = (props) => {
    const {polygonCountLength,
        polygonCountHeight,
        defaultUnitPolygon,
        customizedPolygons,
        axialArray,
        axialMap,
    } = useRadialCurrencyDisplay(props);

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
export default RadialCurrencyDisplay;