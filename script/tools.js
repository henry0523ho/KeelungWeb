$.fn.fixDigits = function(number, digits) {
    return "0".repeat(digits - String(number).length) + String(number);
}