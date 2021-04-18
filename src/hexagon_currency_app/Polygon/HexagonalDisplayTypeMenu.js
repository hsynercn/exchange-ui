import React from 'react'
import {Menu, Dropdown} from 'semantic-ui-react'
import {HexagonalDisplayType} from "../Util/PolygonUtil";


const HexagonalDisplayTypeMenu = (props) => {

    const handleChange = (e, result) => {
        props.setValue(result.value)
    };

    return (<Menu>
        <Dropdown
            item
            simple
            text='View'
            direction='right'
            options={props.options}
            value={props.value}
            onChange={handleChange}
        />
    </Menu>)
}

export default HexagonalDisplayTypeMenu