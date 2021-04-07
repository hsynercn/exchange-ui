import RegularConvexPolygon from "./RegularConvexPolygon";
import React, {useState} from "react";
import {PolygonType} from "./PolygonUtil";

function getPolygonGroupType(axialArray) {
    let arrayLength = axialArray.length;
    let i = 0;
    while (i < arrayLength) {
        if (arrayLength !== axialArray[i].length) {
            return PolygonType.CENTERED;
        }
        i++;
    }
    return PolygonType.GRID;
}

const usePolygonGroup = (props) => {

    let length = props.polygonCountLength;
    let height = props.polygonCountHeight;
    length = length % 2 === 1 ? length : length + 1;
    height = height % 2 === 1 ? height : height + 1;

    const [polygonCountLength, setPolygonCountLength] = useState(length);
    const [polygonCountHeight, setPolygonCountHeight] = useState(height);

    const [axialArray, setAxialArray] = useState(props.axialArray);
    const [axialMap, setAxialMap] = useState(props.axialMap);

    const [widthRatio, setWidthRatio] = useState(1 / polygonCountLength);

    let layoutType = getPolygonGroupType(axialArray);

    const [groupLayoutType, setGroupLayoutType] = useState(layoutType);

    return {
        polygonCountLength,
        polygonCountHeight,
        axialArray,
        axialMap,
        widthRatio,
        groupLayoutType
    };
}

function generateRectangleGridMargins(axialArray, index, dynamicStyle, horizontalMargin, verticalMargin) {
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
    return dynamicStyle;
}

function generateCenteredGridMargins(polygonCountLength, row, tempWidthRatio, axialArray, index, dynamicStyle, horizontalMargin, verticalMargin) {
    let space = polygonCountLength - row.length;

    tempWidthRatio = 1 / row.length;
    if (axialArray.length === index + 1) {
        dynamicStyle = {
            marginLeft: (horizontalMargin * space) + "%",
            marginRight: (horizontalMargin * space) + "%",
        };
    } else if (index % 2 === 0) {
        if (index === 0) {
            dynamicStyle = {
                marginLeft: (horizontalMargin * space) + "%",
                marginBottom: "-" + verticalMargin + "%",
                marginRight: (horizontalMargin * space) + "%",
            };
        } else {
            dynamicStyle = {
                marginLeft: (horizontalMargin * space) + "%",
                marginBottom: "-" + verticalMargin + "%",
                marginRight: (horizontalMargin * space) + "%",
            };
        }
    } else {
        dynamicStyle = {
            marginLeft: (horizontalMargin * space) + "%",
            marginBottom: "-" + verticalMargin + "%",
            marginRight: (horizontalMargin * space) + "%",
        };
    }
    return {tempWidthRatio, dynamicStyle};
}

const PolygonGroup = (props) => {
    const {
        polygonCountLength,
        polygonCountHeight,
        axialArray,
        axialMap,
        widthRatio,
        groupLayoutType
    } = usePolygonGroup(props);

    let horizontalMargin = 0;
    let verticalMargin = 0;

    if (groupLayoutType === PolygonType.GRID) {
        horizontalMargin = (1 / ((polygonCountLength * 2) + 1)) * 100;
        verticalMargin = horizontalMargin / Math.sqrt(3)
    } else if (groupLayoutType === PolygonType.CENTERED) {
        horizontalMargin = (1 / ((polygonCountLength * 2))) * 100;
        verticalMargin = horizontalMargin / Math.sqrt(3)
    }


    return (
        <div style={{
            width: "90%",
            overflowX: "auto",
            overflowY: "auto",
            margin: "0 auto"
        }}>
            {
                axialArray.map((row, index) => {
                        let dynamicStyle = {};
                        let tempWidthRatio = widthRatio;
                        if (groupLayoutType === PolygonType.GRID) {
                            dynamicStyle = generateRectangleGridMargins(axialArray, index, dynamicStyle, horizontalMargin, verticalMargin);
                            tempWidthRatio = widthRatio;
                        } else if (groupLayoutType === PolygonType.CENTERED) {
                            let  __ret = generateCenteredGridMargins(polygonCountLength, row, tempWidthRatio, axialArray, index, dynamicStyle, horizontalMargin, verticalMargin);
                            tempWidthRatio = __ret.tempWidthRatio;
                            dynamicStyle = __ret.dynamicStyle;
                        }
                        return <div
                            style={dynamicStyle}>{
                            row.map((element, index) => <RegularConvexPolygon widthRatio={tempWidthRatio} {...axialMap[element]}
                            />)
                        }</div>
                    }
                )
            }
        </div>
    );
}
export default PolygonGroup;