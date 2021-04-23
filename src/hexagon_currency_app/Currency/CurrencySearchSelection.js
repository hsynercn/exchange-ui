import React from 'react'
import {Dropdown} from 'semantic-ui-react'


const CurrencySearchSelection = (props) => {

    const handleChange = (e, result) => {
        props.setValue(result.value)
    };

    return (
        <div style={{
            width: "90%",
            margin: "1% auto"
        }}><Dropdown style={{backgroundColor:"#cdebff"}}
            placeholder='Select Base Currency'
            fluid
            search
            selection
            onChange={handleChange}
            options={props.options}
            value={props.value}
        /></div>

    )
}

export default CurrencySearchSelection