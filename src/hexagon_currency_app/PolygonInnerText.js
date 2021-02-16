import RegularConvexPolygon from "./RegularConvexPolygon";
import React, {useState} from "react";

const PolygonInnerText = (props) => {
    const [lineMargin, setLineMargin] = useState(26);
    return (
        <>
            {
                props.text.split("\n").map((line, index, array) => <text
                    x={"50%"}
                    //y={"50%"}
                    y={(50 - ((array.length - 1) * (lineMargin / 2)) + (lineMargin * (index))) + "%"}
                    // y={((40 + index * 20) + "%")}
                    textAnchor={"middle"}
                    dominant-baseline={"middle"}
                    fontFamily={"Arial"}
                    fill={"black"}
                    fontSize={"medium"}
                    fontWeight={"normal"}
                >{line}</text>)
            }
        </>
    );
}

export default PolygonInnerText;