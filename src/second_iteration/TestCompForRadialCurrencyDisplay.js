import React from "react";
import CurrencyDisplay from "./CurrencyDisplay";

const TestComptForRadialCurrencyDisplay = (props) => {
    return (
        <>
            <CurrencyDisplay
                polygonCountLength={15}
                polygonCountHeight={13}
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

export default TestComptForRadialCurrencyDisplay;