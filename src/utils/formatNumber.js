// Import the numeral.js library
import numeral from 'numeral';

// ----------------------------------------------------------------------
// Function to format a number using default numeral.js format
export function fNumber(number) {
  return numeral(number).format();
}
// Function to format a number as a currency with a dollar sign and two decimal places
export function fCurrency(number) {
    // Format the number using numeral.js
  const format = number ? numeral(number).format('$0,0.00') : '';
  // Use the helper function to remove the '.00' if the result is an integer
  return result(format, '.00');
}

// Function to format a number as a percentage with one decimal place
export function fPercent(number) {
  // Divide the number by 100 before formatting to get the correct percentage value
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';
  // Use the helper function to remove the '.0' if the result is an integer
  return result(format, '.0');
}
// Function to format a number in shortened form with two decimal places
export function fShortenNumber(number) {
  // Shorten the number to the nearest thousand, million, billion, etc. using numeral.js
  const format = number ? numeral(number).format('0.00a') : '';
  // Use the helper function to remove the '.00' if the result is an integer
  return result(format, '.00');
}
// Function to format a number as data with one decimal place
export function fData(number) {
  // Shorten the number to the nearest thousand, million, billion, etc. using numeral.js
  const format = number ? numeral(number).format('0.0 b') : '';
  // Use the helper function to remove the '.0' if the result is an integer
  return result(format, '.0');
}
// Helper function to remove a specified key from the formatted string
function result(format, key = '.00') {
  // Check if the formatted string includes the specified key
  const isInteger = format.includes(key);
  // If the key is present, remove it and return the updated string
  return isInteger ? format.replace(key, '') : format;
}
