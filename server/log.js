let fs = require('fs')
let Q = require('q')
/**
 * log成一个可读的文件
 * @param  {String} [filename='./server/log/log.txt'] log的文件路径，根目录为 项目目录
 * @param  {String} content                           log的内容
 * @param  {String} [actionName='']                   log的操作名前缀
 * @return {[type]}                                   [description]
 */
let log = (filename = './server/log/log.txt', content, actionName = '') => {
    let date = new Date()
    let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`

    if(!fs.existsSync(filename)) {
        try{
            fs.openSync(filename, 'a+')
        }catch(err) {
            console.error('log.js: ', err)
        }
        console.log(`${time}-- create New Log File: `, filename)
    }
    let asnycLog = Q.nfbind(fs.appendFile.bind(fs))
    asnycLog(filename, `${time}-- ${actionName}: ${content}\n`)
    .catch(err => console.log(`${time}--[ERROR] ${actionName}: `, err))
}
/**
 * 快捷log一个数组
 * @param  {String} [filename='./server/log/log.txt'] [description]
 * @param  {[type]} arrOfObj                          对象的数组
 * @param  {[type]} keyArr                            要记录的对象属性值
 * @param  {String} [actionName='']                   操作名前缀
 * @return {[type]}                                   [description]
 */
let logArray = (filename = './server/log/log.txt', arrOfObj, keyArr, actionName = '') => {
    let content = ''
    for (let i = 0; i < arrOfObj.length; i++) {
        content = content + keyArr.map(key => arrOfObj[i][key]).join('-') + ', '
    }
    log(filename, content, actionName)
}

module.exports = {
    log: log,
    logArray: logArray
}
