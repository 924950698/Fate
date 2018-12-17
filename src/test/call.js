let call = require('../magic-circle.js').call
let list = require('../../server/json/herolist.js')

let res = call(list, 7)
console.log(res.calledHeros, res.allList.length)
