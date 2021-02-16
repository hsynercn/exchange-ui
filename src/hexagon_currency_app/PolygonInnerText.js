import RegularConvexPolygon from "./RegularConvexPolygon";
import React from "react";

const PolygonInnerText = (props) => {
    return (
        <>
            {
                props.text.split("\n").map((line, index) => <text
                    x={"50%"}
                    y={"50%"}
                    // y={((40 + index * 20) + "%")}
                    textAnchor={"middle"}
                    dominant-baseline={"middle"}
                    fontFamily={"Arial"}
                    fill={"black"}
                    fontSize={"125%"}
                    fontWeight={"normal"}
                >{line}</text>)
            }
        </>
    );
}

export default PolygonInnerText;