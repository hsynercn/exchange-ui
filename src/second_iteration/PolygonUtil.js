const PolygonUtils = {
    angleToRadians: (degree) => {
        return degree * (Math.PI / 180);
    },
    generatePoints: (numSides, radius, centerAng, startAngle) => {
        const startAng = PolygonUtils.angleToRadians(startAngle);
        const vertex = [];
        for (let i = 0; i < numSides; i++) {
            const ang = startAng + (i * centerAng);
            let x = (radius * Math.cos(ang));
            let y = (radius * Math.sin(ang));
            vertex.push([x, y]);
        }
        return vertex;
    },
    getEdgePoints: (vertex) => {
        const arrayColumn = (arr, n) => arr.map(x => x[n]);
        let xValues = arrayColumn(vertex, 0);
        let yValues = arrayColumn(vertex, 1);
        let maxX = Math.max(...xValues);
        let maxY = Math.max(...yValues);
        let minX = Math.min(...xValues);
        let minY = Math.min(...yValues);
        return {
            minX: Math.floor(minX),
            minY: Math.floor(minY),
            maxX: Math.ceil(maxX),
            maxY: Math.ceil(maxY)
        };
    },
    getDimensions: (edges) => {
        return {
            xDim: Math.ceil(edges.maxX - edges.minX),
            yDim: Math.ceil(edges.maxY - edges.minY)
        };
    },
    getShiftedPositiveQuadrant: (points, edges) => {
        let shiftedPoints = JSON.parse(JSON.stringify(points));
        shiftedPoints.map(pair => {
            pair[0] += -1 * edges.minX;
            pair[1] += -1 * edges.minY;
            return true;
        });
        return shiftedPoints;
    }
}


export default PolygonUtils;
export const Directions = {
    NORTH: "NORTH",
    SOUTH: "SOUTH",
    NORTHEAST: "NORTHEAST",
    SOUTHWEST: "SOUTHWEST",
    NORTHWEST: "NORTHWEST",
    SOUTHEAST: "SOUTHEAST",
    CENTER: "CENTER",
}