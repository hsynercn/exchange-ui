import {Directions} from "./PolygonUtil";

const MAX_RADIAL_EXPANSE_COUNT = 15;
export const getRadialExpansionSequence = (startX, startY, direction, maxPolygonGroupMemberCount = MAX_RADIAL_EXPANSE_COUNT) => {
    let sequence = [];
    let refX = startX;
    let refY = startY;

    let polygonCount = Math.ceil(maxPolygonGroupMemberCount);
    let tmpCount = 0;

    let factor;
    if (direction === Directions.NORTH || direction === Directions.NORTHEAST || direction === Directions.NORTHWEST) {
        factor = 1;
    } else {
        factor = -1;
        refX = -refX;
        refY = -refY;
    }

    let x = refX;
    let y = refY;

    if (direction === Directions.NORTH || direction === Directions.SOUTH) {
        for (let i = 1; tmpCount < polygonCount; i++) {
            x = refX;
            for (let j = 1; j <= i && tmpCount < polygonCount; j++) {
                sequence.push(factor * x + "," + factor * y);
                x++;
                tmpCount++;
            }
            y--;
        }
    } else if (direction === Directions.NORTHEAST || direction === Directions.SOUTHWEST) {
        for (let i = 1; tmpCount < polygonCount; i++) {
            y = refY;
            for (let j = 1; j <= i && tmpCount < polygonCount; j++) {
                sequence.push(factor * x + "," + factor * y);
                y++;
                tmpCount++;
            }
            x++;
            refY--;
        }
    } else if (direction === Directions.NORTHWEST || direction === Directions.SOUTHEAST) {
        for (let i = 1; tmpCount < polygonCount; i++) {
            x = refX;
            y = refY;
            for (let j = 1; j <= i && tmpCount < polygonCount; j++) {
                sequence.push(factor * x + "," + factor * y);
                x++;
                y--;
                tmpCount++;
            }
            refX--;
        }
    }
    return sequence;
}

export function generateHexagonPolygonGrid(height, length, tempStartX, tempStartY, defaultPolygon) {
    let tempAxialArray = [];
    let tempAxialMap = {};
    for (let j = 0; j < height; j++) {
        tempAxialArray.push([]);
        for (let i = 0; i < length; i++) {
            let coordinateStr = (tempStartX + i - Math.floor(j / 2)) + "," + (tempStartY + j)
            tempAxialArray[j].push(coordinateStr);
            tempAxialMap[coordinateStr] = JSON.parse(JSON.stringify(defaultPolygon));
        }
    }
    return {tempAxialArray, tempAxialMap};
}

export function centeredHexagonPolygonGrid(length, height, defaultPolygon) {
    let originMinCoordinateX = -((length - 1) / 2);
    let originMinCoordinateY = -((height - 1) / 2);

    let topLeftCoordinateX = originMinCoordinateX + Math.floor(-originMinCoordinateY / 2);
    let topLeftCoordinateY = originMinCoordinateY;

    let tempStartX = topLeftCoordinateX;
    let tempStartY = topLeftCoordinateY;

    let {tempAxialArray, tempAxialMap} = generateHexagonPolygonGrid(height, length, tempStartX, tempStartY, defaultPolygon);
    return {tempAxialArray, tempAxialMap};
}

export function getRadialExpansionLimit() {
    return MAX_RADIAL_EXPANSE_COUNT;
}