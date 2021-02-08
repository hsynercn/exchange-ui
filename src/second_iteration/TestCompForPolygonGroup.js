import PolygonGroup from "./PolygonGroup";
import React from "react";
import TestComptForRegularConvexPolygon from "./TestComptForRegularConvexPolygon";

const TestComptForPolygonGroup = (props) => {
    return (
        <>
            <PolygonGroup
                polygonCountLength={5}
                polygonCountHeight={15}
                defaultUnitPolygon={{
                    edgeOffsetRatio: 0.02,
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