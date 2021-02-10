export const largeNumberFormatter = (value) => {

    let expression = ["", "K", "M", "G", "T", "P", "E"];

    let practicalLimit = 6;
    let valueScale = 0;

    while (value >= 1000 && valueScale < practicalLimit) {
        value = value / 1000;
        valueScale++;
    }
    let decimalDigit = value % 1 === 0 ? 1 : 2;
    return value.toFixed(decimalDigit) + expression[valueScale];
}