import React, {useState} from 'react'
import {Dropdown} from 'semantic-ui-react'

const MAX_SELECTION = 6;

const CurrencyMultipleSearchSelection = (props) => {
    const [selectedCurrencies, setSelectedCurrencies] = useState(props.value);

    const handleChange = (e, data) => {
        if (data.value.length <= MAX_SELECTION) {
            setSelectedCurrencies(data.value);
            props.setValue(data.value);
        }
    };

    return (
        <div style={{
            width: "80%",
            margin: "1% auto"
        }}>
            <Dropdown style={{backgroundColor:"powderblue"}}
                placeholder="Select Target Currencies"
                onChange={handleChange}
                value={selectedCurrencies}
                fluid
                multiple
                selectOnNavigation={false}
                search
                selection
                options={props.options}
            />
        </div>
    );
};
export default CurrencyMultipleSearchSelection