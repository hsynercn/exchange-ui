import CurrencyGridDisplay from "./CurrencyGridDisplay";
import React, {useEffect, useState} from "react";
import axios from "axios";
import CurrencySearchSelection from "./CurrencySearchSelection";
import CurrencyMultipleSearchSelection from "./CurrencyMultipleSearchSelection";
import {HexagonalDisplayType} from "./PolygonUtil";
import CurrencyCenteredDisplay from "./CurrencyCenteredDisplay";

const useCurrencyManager = (props) => {

    let temp = HexagonalDisplayType.RADIAL_CENTERED;
    const [currencyDisplayType, setCurrencyDisplayType] = useState(temp);

    const [currencyDisplaySource, setCurrencyDisplaySource] = useState("USD");
    const [currencyDisplayDestinations, setCurrencyDisplayDestinations] = useState(["TRY", "EUR", "GBP", "JPY", "CNY", "HRK"]);
    const [currencyVisualizationData, setCurrencyVisualizationData] = useState({
        type: currencyDisplayType,
        sourceCurrency: {entity: currencyDisplaySource},
        destinationCurrencies: []
    });

    const [selectableCurrencyPool, setSelectableCurrencyPool] = useState([]);

    function formatEmptyCurrencySlots(targetDestinationCurrencies, currencyVisualizationData) {
        for (let i = targetDestinationCurrencies.length; i < 6; i++) {
            currencyVisualizationData.destinationCurrencies.push({
                entity: "---",
                value: 0.0
            });
        }
    }

    useEffect(() => {
        async function fetchCurrencyData() {
            axios.get(`http://localhost:8080/currency`).then(response => {

                let responseBaseCurrency = response.data.main;
                let responseRateMap = {};
                let responseCurrencyPool = [];
                response.data.rates.forEach(rate => {
                    responseRateMap[rate.den] = {entity: rate.den, value: parseFloat(rate.rt), dailyChange: parseFloat(rate.dChg), dailyChangeRate: parseFloat(rate.dChgR)};
                    responseCurrencyPool.push({key: rate.den, text: rate.den, value: rate.den});
                });

                responseCurrencyPool.sort(function (a, b) {
                    let textA = a.key.toUpperCase();
                    let textB = b.key.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                setSelectableCurrencyPool(responseCurrencyPool);

                let targetSourceCurrency = currencyDisplaySource;
                let targetDestinationCurrencies = currencyDisplayDestinations;

                let currencyVisualizationData = {type: "", sourceCurrency: {entity: ""}, destinationCurrencies: []};
                currencyVisualizationData.type = currencyDisplayType;
                if (targetSourceCurrency === responseBaseCurrency) {
                    currencyVisualizationData.sourceCurrency.entity = targetSourceCurrency;

                    targetDestinationCurrencies.forEach((value) => {
                        if (value in responseRateMap) {
                            currencyVisualizationData.destinationCurrencies.push({
                                entity: responseRateMap[value].entity,
                                value: responseRateMap[value].value,
                                dailyChange: responseRateMap[value].dailyChange,
                                dailyChangeRate: responseRateMap[value].dailyChangeRate,
                            });
                        }

                    });

                    formatEmptyCurrencySlots(targetDestinationCurrencies, currencyVisualizationData);

                } else if (targetSourceCurrency in responseRateMap) {
                    currencyVisualizationData.sourceCurrency.entity = targetSourceCurrency;

                    let convertedRateMap = {};
                    let divider = responseRateMap[targetSourceCurrency].value;
                    response.data.rates.forEach(rate => {
                        convertedRateMap[rate.den] = {entity: rate.den, value: parseFloat(rate.rt) / divider, dailyChange: parseFloat(0), dailyChangeRate: parseFloat(0)};
                    });
                    currencyVisualizationData.sourceCurrency.entity = targetSourceCurrency;

                    targetDestinationCurrencies.forEach((value) => {
                        currencyVisualizationData.destinationCurrencies.push({
                            entity: convertedRateMap[value].entity,
                            value: convertedRateMap[value].value,
                            dailyChange: convertedRateMap[value].dailyChange,
                            dailyChangeRate: convertedRateMap[value].dailyChangeRate,
                        });
                    });

                    formatEmptyCurrencySlots(targetDestinationCurrencies, currencyVisualizationData);


                }
                setCurrencyVisualizationData(currencyVisualizationData);
            });
        }

        fetchCurrencyData();
    }, [props, currencyDisplaySource, currencyDisplayDestinations, currencyDisplayType]);
    return {
        currencyVisualizationData,
        selectableCurrencyPool,
        currencyDisplaySource,
        setCurrencyDisplaySource,
        currencyDisplayDestinations,
        setCurrencyDisplayDestinations,
        currencyDisplayType
    };
}

const CurrencyManager = (props) => {
    const {
        currencyVisualizationData,
        selectableCurrencyPool,
        currencyDisplaySource,
        setCurrencyDisplaySource,
        currencyDisplayDestinations,
        setCurrencyDisplayDestinations,
        currencyDisplayType
    } = useCurrencyManager(props);

    let defaultUnitPolygon = {
        edgeOffsetRatio: 0.036,
        startAngle: 90,
        numSides: 6,
        fillColor: '#ffffff',
        strokeColor: '#777777',
        text: "",
        textFontSize: 14,
        innerPolygonRatio: 0.0,
        innerFillColor: "",
    };

    return (
        <>

            {currencyDisplayType === HexagonalDisplayType.RADIAL_GRID &&
            <CurrencyGridDisplay
                currencyVisualizationData={currencyVisualizationData}
                polygonCountLength={13}
                polygonCountHeight={13}
                defaultUnitPolygon={defaultUnitPolygon}
            />
            }

            {currencyDisplayType === HexagonalDisplayType.RADIAL_CENTERED &&
            <CurrencyCenteredDisplay
                currencyVisualizationData={currencyVisualizationData}
                edgeLength={7}
                defaultUnitPolygon={defaultUnitPolygon}
            />
            }

            {currencyDisplayType === HexagonalDisplayType.BASIC_CENTERED &&
            <CurrencyCenteredDisplay
                currencyVisualizationData={currencyVisualizationData}
                edgeLength={2}
                defaultUnitPolygon={defaultUnitPolygon}
            />
            }

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