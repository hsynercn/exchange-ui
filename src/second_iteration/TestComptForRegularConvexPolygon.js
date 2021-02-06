import RegularConvexPolygon from "./RegularConvexPolygon";
import React from "react";

const TestComptForRegularConvexPolygon = (props) => {
    return (<>
        <RegularConvexPolygon radius={40}
                              edgeOffsetRatio={0.03}
                              startAngle={90}
                              numSides={6}
                              fillColor={'#ffffff'}
                              strokeColor={'#aeaeae'}
                              text={""}
                              textFontSize={14}
                              innerPolygonRatio={0.0}
                              innerFillColor={""}/>
    </>);
}

export default TestComptForRegularConvexPolygon;