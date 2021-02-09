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

    let tempAxialArray = [];
    let tempAxialMap = {};
    for (let j = 0; j < height; j++) {
        tempAxialArray.push([]);
        for (let i = 0; i < length; i++) {
            let coordinateStr = (tempStartX + i - Math.floor(j / 2)) + "," + (tempStartY + j)
            tempAxialArray[j].push(coordinateStr);
            tempAxialMap[coordinateStr] = props.defaultUnitPolygon;
        }
    }

    props.customizedPolygons.map((element, index) =>{
        tempAxialMap[element.coordinateStr] = element.polygon;
    });

    const [axialArray, setAxialArray] = useState(tempAxialArray);
    const [axialMap, setAxialMap] = useState(tempAxialMap);
    const [defaultUnitPolygon, setDefaultUnitPolygon] = useState(tempDefaultUnitPolygon);

    const[widthRatio, setWidthRatio] = useState(1 / polygonCountLength);

    return {
        polygonCountLength,
        polygonCountHeight,
        axialArray,
        axialMap,
        defaultUnitPolygon,
        widthRatio
    };
}

const PolygonGroup = (props) => {
    const {
        polygonCountLength,
        polygonCountHeight,
        axialArray,
        axialMap,
        defaultUnitPolygon,
        widthRatio
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