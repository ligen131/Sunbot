export function rand (Min, Max) {
  return (Min + Math.round((Max - Min) * Math.random()));
}

export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export function TimeToDate (time) {
  var date;
  date = new Date(parseInt(time));
  return date.toLocaleString();
}

export function TimeParser (time) {
  if (time == 0) return "0ms";
  var hrs = Math.floor(time / (1000 * 60 * 60));
  time -= hrs * (1000 * 60 * 60);
  var mins = Math.floor(time / (1000 * 60));
  time -= mins * (1000 * 60);
  var seconds = Math.floor(time / 1000);
  time -= seconds * 1000;
  var microseconds = time;
  var text = "";
  if (hrs) text += `${hrs}h`;
  if (mins) text += `${mins}min`;
  if (seconds) text += `${seconds}s`;
  if (microseconds) text += `${microseconds}ms`;
  return text;
}