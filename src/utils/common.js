
import moment from 'moment'
/**
 *
 * @desc 睡眠
 * @param {String} unit:ms
 */
function sleep(time) {
  return new Promise((resolve) => {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, time);
  });
}


function judgeObj(str) {
  if (typeof str == "string") {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == "object" && obj) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
//格式化时间戳
function formatTimestamp(timestamp, format) {
  return timestamp < 0 ? "" : moment(timestamp).format(format)
}

export {
  sleep,
  judgeObj,
  formatTimestamp
};
