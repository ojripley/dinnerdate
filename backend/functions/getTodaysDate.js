const getTodaysDate = function() {
  
  
  let date = new Date();

  let m = date.getMinutes();
  let hh = date.getHours();
  let dd = date.getDate();
  let mm = date.getMonth() + 1; // Jan is 0!
  let yyyy = date.getFullYear();
  if (m < 10) {
    m = '0' + m;
  }
  if (hh < 10) {
    m = '0' + m;
  }
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }

  return yyyy + '-' + mm + '-' + dd;
}

module.exports = getTodaysDate;