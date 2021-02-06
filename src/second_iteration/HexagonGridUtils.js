import {Directions} from "./PolygonUtil";

export const getRadialExpansionSequence = (startX, startY, value, direction) => {
    let sequence = [];
    let refX = startX;
    let refY = startY;

    let polygonCount = Math.ceil(value);
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