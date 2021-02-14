import React from "react";
import CurrencyGridDisplay from "./CurrencyGridDisplay";

const TestComptForRadialCurrencyDisplay = (props) => {
    return (
        <>
            <CurrencyGridDisplay
                polygonCountLength={15}
                polygonCountHeight={15}
                defaultUnitPolygon={{
                    edgeOffsetRatio: 0.036,
                    startAngle: 90,
                    numSides: 6,
                    fillColor: '#ffffff',
                    strokeColor: '#777777',
                    text: "",
                    textFontSize: 14,
                    innerPolygonRatio: 0.0,
                    innerFillColor: "",
                }}
            />
        </>
    );
}

export default TestComptForRadialCurrencyDisplay;