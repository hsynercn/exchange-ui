import PolygonGroup from "./PolygonGroup";
import React, {useEffect, useState} from "react";
import axios from "axios";

const useRadialCurrencyDisplay = (props) => {
    const [polygonCountLength, setPolygonCountLength] = useState(props.polygonCountLength);
    const [polygonCountHeight, setPolygonCountHeight] = useState(props.polygonCountHeight);
    const [defaultUnitPolygon, setDefaultUnitPolygon] = useState(props.defaultUnitPolygon);

    let testColored = [{
        coordinateStr: "0,0", polygon: {
            edgeOffsetRatio: 0.036,
            startAngle: 90,
            numSides: 6,
            fillColor: '#ffffff',
            strokeColor: '#000000',
            text: "",
            textFontSize: 14,
            innerPolygonRatio: 0.0,
            innerFillColor: "",
        }
    }];

    const [customizedPolygons, setCustomizedPolygons] = useState(testColored);

    useEffect(() => {
        axios.get(`http://localhost:8080/currency`).then(response => {
            let currencyMap = response.data;
        });
    });
    return {polygonCountLength, polygonCountHeight, defaultUnitPolygon, customizedPolygons};
}

const RadialCurrencyDisplay = (props) => {
    const {polygonCountLength, polygonCountHeight, defaultUnitPolygon, customizedPolygons} = useRadialCurrencyDisplay(props);

    return (
        <>
            <PolygonGroup
                polygonCountLength={polygonCountLength}
                polygonCountHeight={polygonCountHeight}
                customizedPolygons={customizedPolygons}
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