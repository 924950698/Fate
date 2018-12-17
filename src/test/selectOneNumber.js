let selectOneNumber = require('../magic-circle.js').selectOneNumber

let times = 500
let res = (new Array(times)).fill(0)
for(let i = 0; i < times*500; i++) {
    res[selectOneNumber(0, times)]++
}
// console.log(`selectOneNumber ${times}:`, res.join(','))
var ss = []
for (var i = 0; i < res.length; i++) {
    ss.push(`${i}: ${res[i]}`)
}
console.log(ss.join(','))
