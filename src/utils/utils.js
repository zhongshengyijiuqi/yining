
export const getDate = (time) => {
  var date = time ? new Date(time) : new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return (month + '-' + day)
}

export const getFullDate = (time) => {
  var date = time ? new Date(time) : new Date();
  var year = date.getFullYear()
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return (year + '-' + month + '-' + day)
}