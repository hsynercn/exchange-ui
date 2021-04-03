import {useState} from "react";
import {initHexagonPolygonCenteredGrid} from "./HexagonGridUtils";
import PolygonGroup from "./PolygonGroup";

const useCurrencyCenteredDisplay = (props) => {
    const [edgeLength, setEdgeLength] = useState(props.edgeLength);
    const [defaultUnitPolygon, setDefaultUnitPolygon] = useState(props.defaultUnitPolygon);

    let {tempAxialArray, tempAxialMap} = initHexagonPolygonCenteredGrid(edgeLength, defaultUnitPolygon);

    const [axialArray, setAxialArray] = useState(tempAxialArray);
    const [axialMap, setAxialMap] = useState(tempAxialMap);
    const [customizedPolygons, setCustomizedPolygons] = useState([]);

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