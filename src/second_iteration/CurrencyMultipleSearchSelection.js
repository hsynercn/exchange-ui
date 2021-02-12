import React, {useState} from 'react'
import {Dropdown} from 'semantic-ui-react'

const countryOptions = [
    {key: 'af', value: 'af', text: "TMT"},
    {key: 'ax', value: 'ax', text: "AED"},
    {key: 'al', value: 'al', text: "UGX"},
    {key: 'dz', value: 'dz', text: "UAH"},
    {key: 'as', value: 'as', text: "UYU"},
    {key: 'ad', value: 'ad', text: "UZS"},
    {key: 'ao', value: 'ao', text: "VES"},
    {key: 'ai', value: 'ai', text: "VND"},
    {key: 'ag', value: 'ag', text: "XOF"},
    {key: 'ar', value: 'ar', text: "YER"},
    {key: 'am', value: 'am', text: "ZMW"},
    {key: 'aw', value: 'aw', text: "TMT"},
    {key: 'au', value: 'au', text: "AED"},
    {key: 'at', value: 'at', text: "UGX"},
    {key: 'az', value: 'az', text: "UAH"},
    {key: 'bs', value: 'bs', text: "UYU"},
    {key: 'bh', value: 'bh', text: "UZS"},
    {key: 'bd', value: 'bd', text: "VES"},
    {key: 'bb', value: 'bb', text: "VND"},
    {key: 'by', value: 'by', text: "XOF"},
    {key: 'be', value: 'be', text: "YER"},
    {key: 'bz', value: 'bz', text: "ZMW"},
    {key: 'bj', value: 'bj', text: "ZMW"},
]

const MAX_FRUITS_SELECTION = 6;

const CurrencyMultipleSearchSelection = () => {
    const [fruitId, setFruitId] = useState([]);

    const handleDropFilterFruit = (e, data) => {
        if (data.value.length <= MAX_FRUITS_SELECTION) {
            setFruitId(data.value);
        }
    };

    return (
        <div style={{
            width: "80%",
            margin: "1% auto"
        }}>
            <Dropdown
                placeholder="Select Target Currencies"
                onChange={handleDropFilterFruit}
                value={fruitId}
                fluid
                multiple
                selectOnNavigation={false}
                search
                selection
                options={countryOptions}
            />
        </div>
    );
};
export default CurrencyMultipleSearchSelection