export const MS_IN_SEC = 1_000;
export const SECS_IN_DAY = 86_400;

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
  return date.getTime() / MS_IN_SEC;
}
