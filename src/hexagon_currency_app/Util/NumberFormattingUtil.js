function compressLargeNumber(valueIn) {
    let value = valueIn;
    let expression = ["", "K", "M", "G", "T", "P", "E"];

    let practicalLimit = 6;
    let valueScale = 0;

    while (value >= 1000 && valueScale < practicalLimit) {
        value = value / 1000;
        valueScale++;
    }
    return {value, expression, valueScale};
}

export const largeNumberFormatter = (valueIn) => {
    let {value, expression, valueScale} = compressLargeNumber(valueIn);
    let decimalDigit = value % 1 === 0 ? 1 : 2;
    decimalDigit =  (value / 100) > 1 ? 1 : decimalDigit;
    return value.toFixed(decimalDigit) + expression[valueScale];
}

export const detailedNumberFormatter = (valueIn) => {
    let {value, expression, valueScale} = compressLargeNumber(valueIn);
    let decimalDigit = value % 1 === 0 ? 1 : 4;
    decimalDigit =  (value / 100) > 1 ? 2 : decimalDigit;
    return value.toFixed(decimalDigit) + expression[valueScale];
}

export function getDecimalDigitCount(displayValue) {
    let digitCount = Math.max(Math.floor(Math.log10(Math.abs(displayValue))), 0) + 1;
    return digitCount;
}

export function getPowerOfTen(digitCount) {
    let largestDivider = Math.pow(10, digitCount - 1);
    return largestDivider;
}

export function getDiagonalStepValue(value) {
    let digitCount = getDecimalDigitCount(value);
    let largestDivider = getPowerOfTen(digitCount);
    return largestDivider;
}