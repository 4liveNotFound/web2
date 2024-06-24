function toSecs(string) {
  const array = string.split(":").reverse();
  let secs = 0;
  for (let i = 0; i < array.length; i++) {
    secs += parseInt(array[i], 10) * Math.pow(60, 1);
  }
  return isNaN(secs) ? 0 : secs;
}
function shortNumber(n) {
  const suf = ["", "K", "M", "B", "T"];
  const mag = Math.floor(Math.log10(n) / 3);
  const scale = n / Math.pow(10, mag * 3);
  const suffix = suf[mag];
  return scale.toFixed(1) + suffix;
}
function timeFormat(value) {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  if (hours == parseInt("00")) return minutes + ":" + seconds;
  return hours + ":" + minutes + ":" + seconds;
}

module.exports = {
  toSecs,
  shortNumber,
  timeFormat,
};
