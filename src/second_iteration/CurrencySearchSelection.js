import React from 'react'
import {Dropdown} from 'semantic-ui-react'


const CurrencySearchSelection = (props) => (
    <div style={{
        width: "80%",
        margin: "1% auto"
    }}><Dropdown
        placeholder='Select Base Currency'
        fluid
        search
        selection
        options={props.currencies}
    /></div>

)

export default CurrencySearchSelection