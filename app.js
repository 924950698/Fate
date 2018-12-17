"use strict";
let fs = require('fs')
let express  = require('express')
let cors = require('cors')
let tungus = require('tungus')
let mongoose = require('mongoose')
let bodyParser = require('body-parser')

let app = express()
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));  // for  parsing application/x-www-form-urlencoded
app.use(express.static('.'))
app.use(cors())
// 连接数据库
mongoose.connect('tingodb://' + __dirname + '/data')
let db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', () => {
    console.log("Database open ok!!")
})

require('./server/route.js')(app)

if(!fs.existsSync('./data')) {
    try{
        fs.mkdirSync('./data')
    }catch(err) {
        console.error("app.js", err)
    }
    console.log(`app.js: create ./data Dic `)
}

if(!fs.existsSync('./server/log')) {
    try{
        fs.mkdirSync('./server/log')
    }catch(err) {
        console.error("app.js", err)
    }
    console.log(`app.js: create ./server/log Dic `)
}

let server = app.listen(8081, '0.0.0.0')
console.log('Node Server running at http://127.0.0.1:8081/')
