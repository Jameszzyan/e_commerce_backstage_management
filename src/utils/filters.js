// 时间格式转换函数
export const changeTimeFormat = (value, charA, charB) => {
  var date = new Date(value)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return year + charA + adjustTime(month) + charA + adjustTime(day) + ' ' + hour + charB + minute + charB + second
}

function adjustTime (value) {
  if (parseInt(value) < 10) {
    return '0' + value
  } else {
    return value
  }
}
