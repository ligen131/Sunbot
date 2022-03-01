export function rand (Min, Max) {
  return (Min + Math.round((Max - Min) * Math.random()));
}

export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export function TimeToDate (time) {
  var date;
  date = new Date(parseInt(time));
  return date.toLocaleString();
}