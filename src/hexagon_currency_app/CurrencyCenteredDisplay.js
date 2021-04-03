import {useState} from "react";
import {initHexagonPolygonCenteredGrid} from "./HexagonGridUtils";
import PolygonGroup from "./PolygonGroup";

const useCurrencyCenteredDisplay = (props) => {
    const [edgeLength, setEdgeLength] = useState(props.edgeLength);
    const [defaultUnitPolygon, setDefaultUnitPolygon] = useState(props.defaultUnitPolygon);

    let {tempAxialArray, tempAxialMap} = initHexagonPolygonCenteredGrid(edgeLength, defaultUnitPolygon);
    return {none:"none"};
}

const CurrencyCenteredDisplay = (props) => {
    const {
        none
    } = useCurrencyCenteredDisplay(props);

    return (
        <>
            none
        </>
    );
}
export default CurrencyCenteredDisplay;