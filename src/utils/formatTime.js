// Import functions from the date-fns library
import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

// Function to format a date in a specified format (default: 'dd MMM yyyy')
export function fDate(date, newFormat) {
  // Use the specified format, or the default if no format is provided
  const fm = newFormat || 'dd MMM yyyy';

  // Use the format() function from date-fns to format the date
  return date ? format(new Date(date), fm) : '';
}

// Function to format a date and time in a specified format (default: 'dd MMM yyyy p')
export function fDateTime(date, newFormat) {
  // Use the specified format, or the default if no format is provided
  const fm = newFormat || 'dd MMM yyyy p';

  // Use the format() function from date-fns to format the date and time
  return date ? format(new Date(date), fm) : '';
}

// Function to get the timestamp (in milliseconds) for a specified date
export function fTimestamp(date) {
  // Use the getTime() function from date-fns to get the timestamp for the date
  return date ? getTime(new Date(date)) : '';
}

// Function to format a date in a human-readable format (e.g. '5 minutes ago')
export function fToNow(date) {
  // Use the formatDistanceToNow() function from date-fns to format the time difference between the date and now
  return date
    ? formatDistanceToNow(new Date(date), {
      addSuffix: true,
    })
    : '';
}
