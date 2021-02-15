import RegularConvexPolygon from "./RegularConvexPolygon";
import React from "react";

const TestComptForRegularConvexPolygon = (props) => {
    return (<>
        <div style={{
            width: "75%",
            overflowX: "auto",
            overflowY: "hidden",
            margin: "0 auto"
        }}>
            <RegularConvexPolygon
                innerFillColor={'#ee2f2f'}
                innerPolygonRatio={0.5}
                widthRatio={0.1}
                edgeOffsetRatio={0.03}
                startAngle={90}
                numSides={6}
                fillColor={'#ffffff'}
                strokeColor={'#de0000'}
                text={""}
                textFontSize={14}/>
            <RegularConvexPolygon
                widthRatio={0.1}
                edgeOffsetRatio={0.03}
                startAngle={90}
                numSides={6}
                fillColor={'#ffffff'}
                strokeColor={'#aeaeae'}
                text={""}
                textFontSize={14}
                innerPolygonRatio={0.0}
                innerFillColor={""}/>
            <RegularConvexPolygon
                widthRatio={0.1}
                edgeOffsetRatio={0.03}
                startAngle={90}
                numSides={6}
                fillColor={'#ffffff'}
                strokeColor={'#aeaeae'}
                text={""}
                textFontSize={14}
                innerPolygonRatio={0.0}
                innerFillColor={""}/>
            <RegularConvexPolygon
                widthRatio={0.1}
                edgeOffsetRatio={0.03}
                startAngle={90}
                numSides={6}
                fillColor={'#ffffff'}
                strokeColor={'#aeaeae'}
                text={""}
                textFontSize={14}
                innerPolygonRatio={0.0}
                innerFillColor={""}/>
        </div>
    </>);
}

export default TestComptForRegularConvexPolygon;