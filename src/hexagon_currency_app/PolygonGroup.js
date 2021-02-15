import RegularConvexPolygon from "./RegularConvexPolygon";
import React, {useState} from "react";

const usePolygonGroup = (props) => {

    let length = props.polygonCountLength;
    let height = props.polygonCountHeight;
    length = length % 2 === 1 ? length : length + 1;
    height = height % 2 === 1 ? height : height + 1;

    const [polygonCountLength, setPolygonCountLength] = useState(length);
    const [polygonCountHeight, setPolygonCountHeight] = useState(height);

    const [axialArray, setAxialArray] = useState(props.axialArray);
    const [axialMap, setAxialMap] = useState(props.axialMap);

    const[widthRatio, setWidthRatio] = useState(1 / polygonCountLength);

    return {
        polygonCountLength,
        polygonCountHeight,
        axialArray,
        axialMap,
        widthRatio
    };
}

const PolygonGroup = (props) => {
    const {
        polygonCountLength,
        polygonCountHeight,
        axialArray,
        axialMap,
        widthRatio,
    } = usePolygonGroup(props);

    const horizontalMargin = (1 / ((polygonCountLength * 2) + 1)) * 100;
    const verticalMargin = horizontalMargin / Math.sqrt(3)

    return (
        <div style={{
            width: "80%",
            overflowX: "auto",
            overflowY: "auto",
            margin: "0 auto"
        }}>
            {
                axialArray.map((row, index) => {

                        let dynamicStyle = {};
                        if (axialArray.length === index + 1) {
                            dynamicStyle = {
                                marginRight: horizontalMargin + "%",
                            };
                        } else if (index % 2 === 0) {
                            if (index === 0) {
                                dynamicStyle = {
                                    marginRight: horizontalMargin + "%",
                                    marginBottom: "-" + verticalMargin + "%",
                                };
                            } else {
                                dynamicStyle = {
                                    marginRight: horizontalMargin + "%",
                                    marginBottom: "-" + verticalMargin + "%",
                                };
                            }
                        } else {

                            dynamicStyle = {
                                marginLeft: horizontalMargin + "%",
                                marginBottom: "-" + verticalMargin + "%",
                            };

                        }
                        return <div
                            style={dynamicStyle}>{
                            row.map((element) => <RegularConvexPolygon widthRatio={widthRatio} {...axialMap[element]}
                            />)
                        }</div>
                    }
                )
            }
        </div>
    );
}
export default PolygonGroup;