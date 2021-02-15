import PolygonGroup from "./PolygonGroup";
import React from "react";

const TestComptForPolygonGroup = (props) => {
    return (
        <>
            <PolygonGroup
                polygonCountLength={5}
                polygonCountHeight={5}
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

export default TestComptForPolygonGroup;