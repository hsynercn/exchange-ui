import RegularConvexPolygon from "./RegularConvexPolygon";
import React from "react";

const PolygonInnerText = (props) => {
    return (
        <>
            {
                props.lines.map((line, index) => <text style={
                    {
                        x:(40 + index * 20) + "%",
                        textAnchor: "middle",
                        fontFamily: "Arial"
                    }
                }>line</text>)
            }
        </>
    );
}