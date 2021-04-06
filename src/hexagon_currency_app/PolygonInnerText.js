import RegularConvexPolygon from "./RegularConvexPolygon";
import React, {useState} from "react";

const PolygonInnerText = (props) => {
    const [lineMargin, setLineMargin] = useState(26);
    return (
        <>
            {
                props.text.split("\n").map((line, index, array) => {

                    let fontSize = "medium";
                    let tempLineMargin = 26;
                    if (array.length === 2) {
                        fontSize = "medium";
                        tempLineMargin = 26;
                    } else if (array.length === 3) {
                        let lineSizes = ["xx-small", "medium", "xx-small"];
                        fontSize = lineSizes[index];
                        tempLineMargin = 20;
                    }

                    return <text
                        x={"50%"}
                        //y={"50%"}
                        y={(50 - ((array.length - 1) * (tempLineMargin / 2)) + (tempLineMargin * (index))) + "%"}
                        // y={((40 + index * 20) + "%")}
                        textAnchor={"middle"}
                        dominant-baseline={"middle"}
                        fontFamily={"Arial"}
                        fill={"black"}
                        fontSize={fontSize}
                        fontWeight={"normal"}
                    >{line}</text>;
                })
            }
        </>
    );
}

export default PolygonInnerText;