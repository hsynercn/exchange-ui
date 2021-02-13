import CurrencyGridDisplay from "./CurrencyGridDisplay";
import {useEffect, useState} from "react";
import axios from "axios";

const useCurrencyManager = (props) => {
    const [currencyDisplayType, setCurrencyDisplayType] = useState("radial");

    const [currencyDisplaySource, setCurrencyDisplaySource] = useState("USD");
    const [currencyDisplayDestinations, setCurrencyDisplayDestinations] = useState(["USD", "EUR", "GBP", "CAD", "ETH", "BTC"]);
    const [currencyVisualizationData, setCurrencyVisualizationData] = useState({
        type: currencyDisplayType,
        sourceCurrency: {entity: currencyDisplaySource},
        destinationCurrencies: [
            {entity:"USD", value:0.0 },
            {entity:"EUR", value:0.0 },
            {entity:"GBP", value:0.0 },
            {entity:"CAD", value:0.0 },
            {entity:"ETH", value:0.0 },
            {entity:"BTC", value:0.0 },
        ]
    });

    useEffect(() => {
        axios.get(`http://localhost:8080/currency`).then(response => {

            let responseBaseCurrency = response.data.base;
            let responseRateMap = {};
            response.data.rates.forEach(rate => {
                responseRateMap[rate.entity] = rate
            });

            let targetSourceCurrency = currencyDisplaySource;
            let targetDestinationCurrencies = currencyDisplayDestinations;

            let currencyVisualizationData = {type: "", sourceCurrency: {entity: ""}, destinationCurrencies: []};
            currencyVisualizationData.type = currencyDisplayType;
            if (targetSourceCurrency === responseBaseCurrency) {
                currencyVisualizationData.sourceCurrency.entity = targetSourceCurrency;
                targetDestinationCurrencies.forEach((value, index, array) => {
                    currencyVisualizationData.destinationCurrencies.push({
                        entity: responseRateMap[value].entity,
                        value: responseRateMap[value].value
                    });
                });
            } else if(targetSourceCurrency in responseRateMap) {

            } else {
                alert("Unsupported currency");
            }
            setCurrencyVisualizationData(currencyVisualizationData);
        });
    }, [props]);
    return {currencyVisualizationData};
}

const CurrencyManager = (props) => {
    const {currencyVisualizationData} = useCurrencyManager(props);
    return (
        <>
            <CurrencyGridDisplay
                currencyVisualizationData={currencyVisualizationData}
                polygonCountLength={11}
                polygonCountHeight={13}
                defaultUnitPolygon={{
                    edgeOffsetRatio: 0.036,
                    startAngle: 90,
                    numSides: 6,
                    fillColor: '#ffffff',
                    strokeColor: '#777777',
                    text: "",
                    textFontSize: 14,
                    innerPolygonRatio: 0.0,
                    innerFillColor: "",
                }}
            />
        </>
    )
}

export default CurrencyManager;