import CurrencyGridDisplay from "./CurrencyGridDisplay";
import React, {useEffect, useState} from "react";
import axios from "axios";
import CurrencySearchSelection from "./CurrencySearchSelection";
import CurrencyMultipleSearchSelection from "./CurrencyMultipleSearchSelection";
import {Dropdown} from "semantic-ui-react";

const useCurrencyManager = (props) => {
    const [currencyDisplayType, setCurrencyDisplayType] = useState("radial");

    const [currencyDisplaySource, setCurrencyDisplaySource] = useState("USD");
    const [currencyDisplayDestinations, setCurrencyDisplayDestinations] = useState(["TRY", "EUR", "GBP", "CAD", "ETH", "BTC"]);
    const [currencyVisualizationData, setCurrencyVisualizationData] = useState({
        type: currencyDisplayType,
        sourceCurrency: {entity: currencyDisplaySource},
        destinationCurrencies: []
    });

    const [selectableCurrencyPool, setSelectableCurrencyPool] = useState([]);

    function formatEmptyCurrenySlots(targetDestinationCurrencies, currencyVisualizationData) {
        let i = 0;
        for (i = targetDestinationCurrencies.length; i < 6; i++) {
            currencyVisualizationData.destinationCurrencies.push({
                entity: "---",
                value: 0.0
            });
        }
    }

    useEffect(() => {
        async function fetchCurrencyData() {
            axios.get(`http://localhost:8080/currency`).then(response => {

                let responseBaseCurrency = response.data.base;
                let responseRateMap = {};
                let responseCurrencyPool = [];
                response.data.rates.forEach(rate => {
                    responseRateMap[rate.entity] = rate;
                    responseCurrencyPool.push({key: rate.entity, text: rate.entity, value: rate.entity});
                });

                setSelectableCurrencyPool(responseCurrencyPool)

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

                    formatEmptyCurrenySlots(targetDestinationCurrencies, currencyVisualizationData);

                } else if (targetSourceCurrency in responseRateMap) {
                    currencyVisualizationData.sourceCurrency.entity = targetSourceCurrency;

                    let convertedRateMap = {};
                    let divider = responseRateMap[targetSourceCurrency].value;
                    response.data.rates.forEach(rate => {
                        convertedRateMap[rate.entity] = rate;
                        convertedRateMap[rate.entity].value = convertedRateMap[rate.entity].value / divider;
                    });
                    currencyVisualizationData.sourceCurrency.entity = targetSourceCurrency;

                    targetDestinationCurrencies.forEach((value, index, array) => {
                        currencyVisualizationData.destinationCurrencies.push({
                            entity: convertedRateMap[value].entity,
                            value: convertedRateMap[value].value
                        });
                    });

                    formatEmptyCurrenySlots(targetDestinationCurrencies, currencyVisualizationData);


                }
                setCurrencyVisualizationData(currencyVisualizationData);
            });
        }

        fetchCurrencyData();
    }, [props, currencyDisplaySource, currencyDisplayDestinations]);
    return {
        currencyVisualizationData,
        selectableCurrencyPool,
        currencyDisplaySource,
        setCurrencyDisplaySource,
        currencyDisplayDestinations,
        setCurrencyDisplayDestinations
    };
}

const CurrencyManager = (props) => {
    const {
        currencyVisualizationData,
        selectableCurrencyPool,
        currencyDisplaySource,
        setCurrencyDisplaySource,
        currencyDisplayDestinations,
        setCurrencyDisplayDestinations
    } = useCurrencyManager(props);
    return (
        <>
            <CurrencyGridDisplay
                currencyVisualizationData={currencyVisualizationData}
                polygonCountLength={13}
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
            <CurrencySearchSelection setValue={setCurrencyDisplaySource}
                                     options={selectableCurrencyPool}
                                     value={currencyDisplaySource}/>
            <CurrencyMultipleSearchSelection setValue={setCurrencyDisplayDestinations}
                                             options={selectableCurrencyPool}
                                             value={currencyDisplayDestinations}/>
        </>
    )
}

export default CurrencyManager;