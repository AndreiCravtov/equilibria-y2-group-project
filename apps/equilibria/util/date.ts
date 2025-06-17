export const MS_IN_SEC = 1_000;
export const SECS_IN_DAY = 86_400;
export const SECS_IN_HOUR = 3_600;

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function roundDownToDayDate(date: Date) {
  // set everything to zero
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
}

export function roundDownToDayTimestamp(unixTimestamp: number) {
  const date = timestampToDate(unixTimestamp);
  roundDownToDayDate(date);

  return dateToTimestamp(date);
}

export function getCurrentDayTimestamp() {
  const todayDate = new Date(Date.now());
  roundDownToDayDate(todayDate);

  return dateToTimestamp(todayDate);
}

export function getCurrentTimestamp() {
  return Math.floor(Date.now() / MS_IN_SEC);
}

export function nextDayTimestamp(unixTimestamp: number) {
  return roundDownToDayTimestamp(unixTimestamp) + SECS_IN_DAY;
}

export function previousDayTimestamp(unixTimestamp: number) {
  return roundDownToDayTimestamp(unixTimestamp) - SECS_IN_DAY;
}

export function timestampToDate(unixTimestamp: number) {
  return new Date(unixTimestamp * MS_IN_SEC);
}

export function dateToTimestamp(date: Date) {
  return Math.floor(date.getTime() / MS_IN_SEC);
}

export function formatDateDay(date: Date) {
  function getOrdinalSuffix(n: number) {
    const SUFFIX = ["st", "nd", "rd"];
    const n1 = n % 100;
    const n2 = n % 10;
    if (10 < n1 && n1 < 20) return "th";
    return SUFFIX[n2 - 1] ?? "th";
  }

  const day = DAYS[date.getUTCDay()];
  const monthDate = date.getUTCDate();

  return `${day} ${monthDate}${getOrdinalSuffix(monthDate)}`;
}
