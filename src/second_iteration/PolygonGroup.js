import RegularConvexPolygon from "./RegularConvexPolygon";
import React, {useState} from "react";

const usePolygonGroup = (props) => {

    let length = props.polygonCountLength;
    let height = props.polygonCountHeight;
    length = length % 2 === 1 ? length : length + 1;
    height = height % 2 === 1 ? height : height + 1;

    const [polygonCountLength, setPolygonCountLength] = useState(length);
    const [polygonCountHeight, setPolygonCountHeight] = useState(height);

    let originMinCoordinateX = -((length - 1) / 2);
    let originMinCoordinateY = -((height - 1) / 2);

    let topLeftCoordinateX = originMinCoordinateX + Math.floor(-originMinCoordinateY / 2);
    let topLeftCoordinateY = originMinCoordinateY;

    let tempStartX = topLeftCoordinateX;
    let tempStartY = topLeftCoordinateY;

    let tempDefaultUnitPolygon = {};

    if (typeof props.defaultUnitPolygon.widthRatio === "undefined") {
        tempDefaultUnitPolygon = JSON.parse(JSON.stringify(props.defaultUnitPolygon));
        tempDefaultUnitPolygon.widthRatio = 1 / polygonCountLength;
    } else {
        tempDefaultUnitPolygon = JSON.parse(JSON.stringify(props.defaultUnitPolygon));
    }

    let tempAxialArray = [];
    let tempAxialMap = {};
    for (let j = 0; j < height; j++) {
        tempAxialArray.push([]);
        for (let i = 0; i < length; i++) {
            let coordinateStr = (tempStartX + i - Math.floor(j / 2)) + "," + (tempStartY + j)
            tempAxialArray[j].push(coordinateStr);
            tempAxialMap[coordinateStr] = tempDefaultUnitPolygon;
        }
    }

    const [axialArray, setAxialArray] = useState(tempAxialArray);
    const [axialMap, setAxialMap] = useState(tempAxialMap);
    const [defaultUnitPolygon, setDefaultUnitPolygon] = useState(tempDefaultUnitPolygon);

    return {
        polygonCountLength,
        polygonCountHeight,
        axialArray,
        axialMap,
        defaultUnitPolygon
    };
}

const PolygonGroup = (props) => {
    const {
        polygonCountLength,
        polygonCountHeight,
        axialArray,
        axialMap,
        defaultUnitPolygon
    } = usePolygonGroup(props);

    const horizontalMargin = (1 / ((polygonCountLength * 2) + 1)) * 100;

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
                                //marginTop: "-5.196%",
                                //marginBottom: "-5.196%"
                            };
                        } else if (index % 2 === 0) {
                            if (index === 0) {
                                dynamicStyle = {
                                    marginRight: horizontalMargin + "%",
                                    marginBottom: "-5.196%",
                                };
                            } else {
                                dynamicStyle = {
                                    marginRight: horizontalMargin + "%",
                                    //marginTop: "-5.196%",
                                    marginBottom: "-5.196%",
                                };
                            }
                        } else {

                            dynamicStyle = {
                                marginLeft: horizontalMargin + "%",
                                //marginTop: "-5.196%",
                                marginBottom: "-5.196%",
                            };

                        }
                        return <div
                            style={dynamicStyle}>{
                            row.map((element) => <RegularConvexPolygon {...axialMap[element]}
                            />)
                        }</div>
                    }
                )
            }
        </div>
    );
}
export default PolygonGroup;