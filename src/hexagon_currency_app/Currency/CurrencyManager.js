import CurrencyGridDisplay from "./CurrencyGridDisplay";
import React, {useEffect, useState} from "react";
import axios from "axios";
import CurrencySearchSelection from "./CurrencySearchSelection";
import CurrencyMultipleSearchSelection from "./CurrencyMultipleSearchSelection";
import {HexagonalDisplayType} from "../Util/PolygonUtil";
import CurrencyCenteredDisplay from "./CurrencyCenteredDisplay";
import ECBDataSourceInformer from "./ECBDataSourceInformer";
import HexagonalDisplayTypeMenu from "../Polygon/HexagonalDisplayTypeMenu";
import {isMobile} from "../Util/DeviceUtil";

const useCurrencyManager = (props) => {

    const selectableCurrencyDisplayTypes = [
        { key: HexagonalDisplayType.BASIC_CENTERED, text: 'Basic', value: HexagonalDisplayType.BASIC_CENTERED },
        { key: HexagonalDisplayType.RADIAL_CENTERED, text: 'Hexagonal', value: HexagonalDisplayType.RADIAL_CENTERED },
        { key: HexagonalDisplayType.RADIAL_GRID, text: 'Full', value: HexagonalDisplayType.RADIAL_GRID },
    ]
    let temp = selectableCurrencyDisplayTypes[1];
    if(isMobile()) {
        temp = selectableCurrencyDisplayTypes[0];
    }
    const [currencyDisplayType, setCurrencyDisplayType] = useState(temp.key);

    const [currencyDisplaySource, setCurrencyDisplaySource] = useState("USD");
    const [currencyDisplayDestinations, setCurrencyDisplayDestinations] = useState(["TRY", "EUR", "GBP", "JPY", "CNY", "HRK"]);
    const [currencyVisualizationData, setCurrencyVisualizationData] = useState({
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
                    responseRateMap[rate.den] = {
                        entity: rate.den,
                        value: parseFloat(rate.rt),
                        dailyChange: parseFloat(rate.dChg),
                        dailyChangeRate: parseFloat(rate.dChgR)
                    };
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
                    let currencyConverter = responseRateMap[targetSourceCurrency].value;
                    let currencyConverterPrevious = responseRateMap[targetSourceCurrency].value - responseRateMap[targetSourceCurrency].dailyChange;
                    response.data.rates.forEach(rate => {
                        let value = parseFloat(rate.rt) / currencyConverter;
                        let previousValue = parseFloat(rate.rt) - parseFloat(rate.dChg);
                        let previousRate = 1 / (currencyConverterPrevious / previousValue);
                        convertedRateMap[rate.den] = {
                            entity: rate.den,
                            value: value,
                            dailyChange: value - previousRate,
                            dailyChangeRate: (value - previousRate) / value
                        };
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
        currencyDisplayType,
        setCurrencyDisplayType,
        selectableCurrencyDisplayTypes
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
        currencyDisplayType,
        setCurrencyDisplayType,
        selectableCurrencyDisplayTypes
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

            <HexagonalDisplayTypeMenu setValue={setCurrencyDisplayType}
                                                  options={selectableCurrencyDisplayTypes}
                                                  value={currencyDisplayType}/>
            {currencyDisplayType === HexagonalDisplayType.RADIAL_GRID &&
            <CurrencyGridDisplay
                type={currencyDisplayType}
                currencyVisualizationData={currencyVisualizationData}
                polygonCountLength={13}
                polygonCountHeight={13}
                defaultUnitPolygon={defaultUnitPolygon}
            />
            }

            {currencyDisplayType === HexagonalDisplayType.RADIAL_CENTERED &&
            <CurrencyCenteredDisplay
                type={currencyDisplayType}
                currencyVisualizationData={currencyVisualizationData}
                edgeLength={7}
                defaultUnitPolygon={defaultUnitPolygon}
            />
            }

            {currencyDisplayType === HexagonalDisplayType.BASIC_CENTERED &&
            <CurrencyCenteredDisplay
                type={currencyDisplayType}
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
            <ECBDataSourceInformer/>

        </>
    )
}

export default CurrencyManager;